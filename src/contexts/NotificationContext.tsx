import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import axios from '../helpers/axios';

interface Sender {
    id: string;
    name: string;
    email: string;
    role: string;
    image: string;
}

interface Receiver {
    email: string;
    name: string;
    is_seen: boolean;
}

export interface Notification {
    id?: string;
    noti_type: string;
    sender: Sender;
    receivers: Receiver[];
    content: string;
    created_at: string;
    updated_at: string;
}

interface NotificationContextValue {
    notifications: Notification[];
    loading: boolean;
    error: string;
    unseenCount: number;
    refreshNotifications: () => Promise<void>;
    markAsSeen: (notificationId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);

    const fetchNotifications = async () => {
        if (!auth?.user?.email) return;

        try {
            setLoading(true);
            setError('');
            const response = await axios.get(`/api/fmiis-backend/v001/get-all-notifications/${auth.user.email}`);
            console.log("Notifications fetched:", response.data);
            setNotifications(response.data || []);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to fetch notifications');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const markAsSeen = async (notificationId: string) => {
        if (!auth?.user?.email) return;

        try {
            await axios.post(`/api/fmiis-backend/v001/mark-notification-as-seen/${notificationId}`, {
                email: auth.user.email
            });

            // Update local state optimistically
            setNotifications(prev =>
                prev.map(noti => {
                    if (noti.id === notificationId) {
                        return {
                            ...noti,
                            receivers: noti.receivers.map(receiver =>
                                receiver.email === auth.user?.email
                                    ? { ...receiver, is_seen: true }
                                    : receiver
                            )
                        };
                    }
                    return noti;
                })
            );
        } catch (err) {
            console.error('Error marking notification as seen:', err);
        }
    };

    // Calculate unseen count
    const unseenCount = notifications.filter(noti => {
        const userReceiver = noti.receivers.find(r => r.email === auth?.user?.email);
        return userReceiver && !userReceiver.is_seen;
    }).length;

    useEffect(() => {
        if (auth?.user?.email) {
            fetchNotifications();
        }
    }, [auth?.user?.email]);

    const value: NotificationContextValue = {
        notifications,
        loading,
        error,
        unseenCount,
        refreshNotifications: fetchNotifications,
        markAsSeen
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
