import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Bell, Send, Clock } from 'lucide-react';

const Notifications: React.FC = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const { notifications, loading, error, markAsSeen } = useNotifications();

    const authUserRole = auth?.user?.role;
    const canSendNotification = ['gm', 'md', 'hr'].includes(authUserRole || '');
    let urlRole: string;
    switch (authUserRole) {
        case 'gm':
            urlRole = 'gm-md';
            break;
        case 'md':
            urlRole = 'gm-md';
            break;
        case 'hr':
            urlRole = 'hr';
            break;
        case 'dev':
            urlRole = 'dev';
            break;
        default:
            urlRole = '';
    }

    const handleSingleNotificationClick = async (notificationId: string | undefined) => {
        if (!notificationId) return;

        await markAsSeen(notificationId);
        navigate(`/${urlRole}/notifications/${notificationId}`);
    };

    return (
        <div className="notifications-page">
            <div className="main-content">
                <div className="p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                    <Bell className="w-8 h-8 text-blue-400" />
                                    Notifications
                                </h1>
                                <p className="text-zinc-400">Stay updated with meetings and announcements</p>
                            </div>
                            {canSendNotification && (
                                <button
                                    onClick={() => navigate(`/${urlRole}/notifications/send`)}
                                    className="flex items-center gap-2 !bg-zinc-950 hover:!bg-zinc-900 !text-white !px-3 !py-1.5 !rounded-lg transition-all shadow-md hover:shadow-lg !font-medium !text-sm !border !border-zinc-800"
                                >
                                    <Send size={16} />
                                    Send Notification
                                </button>
                            )}
                        </div>

                        {error && <div className="text-red-500 mb-4 bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</div>}

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {notifications?.length === 0 ? (
                                    <div className="text-center py-12 text-zinc-500">
                                        No notifications found.
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {notifications?.map((noti, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleSingleNotificationClick(noti.id)}
                                                className={`glass-panel p-6 rounded-xl relative overflow-hidden transition-all group cursor-pointer
                                                    ${noti.receivers.map((receiver) => receiver.email === auth?.user?.email && receiver.is_seen == true)
                                                        ? 'border-l-4 border-l-blue-500 bg-blue-500/5'
                                                        : 'border border-white/5 bg-white/[0.02] opacity-80 hover:opacity-100'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {!noti.receivers.map((receiver) => receiver.email === auth?.user?.email && receiver.is_seen == true).includes(true) && (
                                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-1"></div>
                                                            )}
                                                            <span className={`px-2 py-0.5 rounded text-xs font-medium 
                                                                ${noti.noti_type === 'Emergency Meeting' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                                                    noti.noti_type.includes('Meeting') ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                                                        'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'}`}>
                                                                {noti.noti_type}
                                                            </span>
                                                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                                <Clock size={12} />
                                                                {new Date(noti.created_at).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p className={`whitespace-pre-wrap leading-relaxed ${!noti.receivers.map((receiver) => receiver.email === auth?.user?.email && receiver.is_seen == true).includes(true) ? 'text-white/90 font-medium' : 'text-zinc-400'}`}>
                                                            {noti.content.split(' ').slice(0, 10).join(' ')}.........
                                                        </p>
                                                        <div className="mt-4 flex items-center gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold border border-white/10">
                                                                    {noti.sender.image ? (
                                                                        <img src={noti.sender.image} alt={noti.sender.name} className="w-full h-full object-cover rounded-full" />
                                                                    ) : (
                                                                        noti.sender.name.charAt(0)
                                                                    )}
                                                                </div>
                                                                <span className="text-xs text-zinc-400">Sent by <span className="text-white/80">{noti.sender.name}</span></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .glass-panel {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
};

export default Notifications;
