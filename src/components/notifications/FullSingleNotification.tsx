import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../helpers/axios';
import { ArrowLeft } from 'lucide-react';
import './FullSingleNotification.css';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import NotFoundInline from '../NotFoundInline/NotFoundInline';
import { User } from 'lucide-react';

interface Sender {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    image: string;
}

interface Notification {
    _id?: string;
    noti_type: string;
    sender: Sender;
    content: string;
    created_at: string;
    updated_at: string;
}

const FullSingleNotification: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState<Notification | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                // User mentioned fetching single notification with :id
                const response = await axios.get(`/api/fmiis-backend/v001/get-single-notification/${id}`);
                console.log("Single Notification Response:", response.data);
                // Assuming response structure is the notification object directly or wrapped.
                // Based on "The return datastructure from backend will be same except for one thing, array and single obj."
                // So response.data might be the object itself.
                setNotification(response.data);
            } catch (err) {
                console.error("Error fetching notification:", err);
                setError("Failed to load notification details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNotification();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black/90">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !notification) {
        return (
            <div className="full-notification-page">
                <div className="main-content">
                    <NotFoundInline
                        title="Notification Not Found"
                        message={error || "The notification you're looking for doesn't exist or may have been removed."}
                        backPath={`/${auth?.user?.role}/notifications`}
                        showImage={true}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="full-notification-page">
            <div className="main-content">
                <div className="p-6 md:p-8">
                    <div className="max-w-3xl mx-auto mb-6">
                        <button
                            onClick={() => navigate(`/${auth?.user?.role}/notifications`)}
                            className="flex items-center gap-2 !bg-zinc-950 hover:!bg-zinc-900 !text-white !px-3 !py-1.5 !rounded-lg transition-all shadow-md hover:shadow-lg !font-medium !text-sm !border !border-zinc-800"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    </div>

                    <div className="email-container glass-email">
                        <div className="email-header">
                            <h1 className="email-title">🔔 Findix Myanmar Internal Information System</h1>
                            <p className="email-subtitle">Email Notification System</p>
                        </div>

                        <div className="email-content">
                            <div className="email-noti-type text-white">{notification.noti_type} Notification</div>

                            <div className="email-message-box">
                                <h3 className="email-section-title">📝 Message</h3>
                                <p className="email-message-text">
                                    {notification.content.split(/(https?:\/\/[^\s]+)/g).map((part, i) => (
                                        part.match(/https?:\/\/[^\s]+/) ? (
                                            <a
                                                key={i}
                                                href={part}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors break-all"
                                            >
                                                {part}
                                            </a>
                                        ) : (
                                            part
                                        )
                                    ))}
                                </p>
                            </div>

                            <div className="email-info-box">
                                <div className="flex gap-3">
                                    <h3 className="email-section-title">👤 From</h3>
                                    {notification.sender.image ? (
                                        <img src={import.meta.env.VITE_BACKEND_URL + notification.sender.image} alt="" className='w-10 h-10 rounded-full mb-4' />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <table className="email-table">
                                    <tbody>
                                        <tr>
                                            <td className="email-label"><strong>Name:</strong></td>
                                            <td className="email-value">{notification.sender.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="email-label"><strong>Role:</strong></td>
                                            <td className="email-value"><span className="email-badge">{notification.sender.role}</span></td>
                                        </tr>
                                        <tr>
                                            <td className="email-label"><strong>Email:</strong></td>
                                            <td className="email-value">{notification.sender.email}</td>
                                        </tr>
                                        {notification.sender.phone && (
                                            <tr>
                                                <td className="email-label"><strong>Phone:</strong></td>
                                                <td className="email-value">{notification.sender.phone}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="email-timestamp">
                                <p><strong>🕒 Sent:</strong> {new Date(notification.created_at).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                {notification.updated_at !== notification.created_at && (
                                    <p className="mt-1"><strong>✏️ Last Edited:</strong> {new Date(notification.updated_at).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                )}
                            </div>
                        </div>

                        <div className="email-footer">
                            <p>This is an automated notification from Findix FMIIS System</p>
                            <p>© {new Date().getFullYear()} Findix Myanmar. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullSingleNotification;
