import React, { useState, useRef, useEffect, useContext } from 'react';
import { Bell, User, LogOut, Settings, Menu, Clock } from 'lucide-react';
import './Nav.css';
import './NotificationDropdown.css';
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../contexts/NotificationContext';
import axios from 'axios';

interface NavProps {
    toggleSidebar: () => void;
}

const Nav: React.FC<NavProps> = ({ toggleSidebar }) => {
    const [notificationDropdown, setNotificationDropdown] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);

    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const auth = useContext(AuthContext);
    const user = auth?.user;
    const navigate = useNavigate();
    const { notifications, unseenCount, markAsSeen } = useNotifications();

    const handleLogout = async () => {
        try {
            const res = await axios.post("/api/fmiis-backend/v001/logout", {},);
            if (res.status === 200) {
                if (auth) {
                    auth.dispatch({ type: 'LOGOUT' });
                    console.log('Logout successful');
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    const handleNotificationClick = async (notificationId: string | undefined) => {
        if (!notificationId) return;

        await markAsSeen(notificationId);
        setNotificationDropdown(false);
        navigate(`/gm-md/notifications/${notificationId}`);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationDropdown(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Get user-specific notifications (only first 5 for dropdown)
    const userNotifications = notifications
        .filter(noti => noti.receivers.some(r => r.email === user?.email))
        .slice(0, 5);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="hamburger" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <span className="user-info">
                    <span className="user-name">{user?.name}</span>
                    <span className="user-role">{user?.role}</span>
                </span>
            </div>
            <div className="navbar-right">
                <div className="notification-icon" ref={notificationRef} onClick={() => setNotificationDropdown(!notificationDropdown)}>
                    <Bell size={20} />
                    {unseenCount > 0 && (
                        <span className="notification-badge">{unseenCount}</span>
                    )}
                    {notificationDropdown && (
                        <div className="dropdown notification-dropdown">
                            <div className="notification-dropdown-header">
                                <h3>Notifications</h3>
                                {unseenCount > 0 && <span className="unseen-count">{unseenCount} new</span>}
                            </div>
                            <ul className="notification-list">
                                {userNotifications.length === 0 ? (
                                    <li className="no-notifications">No notifications</li>
                                ) : (
                                    userNotifications.map((noti, index) => {
                                        const userReceiver = noti.receivers.find(r => r.email === user?.email);
                                        const isUnseen = userReceiver && !userReceiver.is_seen;

                                        return (
                                            <li
                                                key={index}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => handleNotificationClick(noti.id)}
                                                className={`notification-item ${isUnseen ? 'unseen' : ''}`}
                                            >
                                                <div className="notification-item-header">
                                                    {isUnseen && <div className="unseen-dot"></div>}
                                                    <span className={`notification-type ${noti.noti_type === 'Emergency Meeting' ? 'emergency' : noti.noti_type.includes('Meeting') ? 'meeting' : 'general'}`}>
                                                        {noti.noti_type}
                                                    </span>
                                                </div>
                                                <p className="notification-content">
                                                    {noti.content.split(' ').slice(0, 8).join(' ')}...
                                                </p>
                                                <div className="notification-meta">
                                                    <Clock size={12} />
                                                    <span>{new Date(noti.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                            {userNotifications.length > 0 && (
                                <div className="notification-dropdown-footer">
                                    <button onClick={() => { setNotificationDropdown(false); navigate('/gm-md/notifications'); }}>
                                        View All Notifications
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="profile-icon" ref={profileRef} onClick={() => setProfileDropdown(!profileDropdown)}>
                    {user?.image ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                            <img
                                src={user.image}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <User size={20} />
                    )}
                    {profileDropdown && (
                        <div className="dropdown profile-dropdown">
                            <ul>
                                <li onClick={() => { /* account click */ }}>
                                    <Settings size={16} />
                                    <span>Account</span>
                                </li>
                                <li onClick={() => { handleLogout() }}>
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
