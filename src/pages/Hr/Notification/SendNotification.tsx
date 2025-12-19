import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
// import './Notifications.css';

const notiTypes = [
    "Morning Meeting",
    "Developer Meeting",
    "Kosugi Meeting",
    "Emergency Meeting",
    "Internal Meeting",
    "General"
];

const SendNotification: React.FC = () => {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState(notiTypes[0]);
    const [content, setContent] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock send action as requested
        console.log("Sending Notification:", { type: selectedType, content });
        alert("Notification Sent! (Mock)");
        navigate('/hr/notifications');
    };

    return (
        <div className="send-notification-page">
            <div className="main-content">
                <div className="p-6 md:p-8">
                    <div className="max-w-2xl mx-auto">
                        <button
                            onClick={() => navigate('/hr/notifications')}
                            className="mb-6 flex items-center gap-2 !bg-zinc-950 hover:!bg-zinc-900 !text-white !px-3 !py-1.5 !rounded-lg transition-all shadow-md hover:shadow-lg !font-medium !text-sm !border !border-zinc-800"
                        >
                            <ArrowLeft size={16} />
                            Back to Notifications
                        </button>

                        <div className="glass-form p-8 rounded-2xl border border-white/10 shadow-2xl">
                            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Send className="text-blue-500" />
                                Send New Notification
                            </h1>

                            <form onSubmit={handleSend} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Notification Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {notiTypes.map((type) => (
                                            <button
                                                type="button"
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={`p-3 rounded-lg text-sm text-left transition-all border ${selectedType === type
                                                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                                                    : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Content</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={6}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                        placeholder="Enter notification content here..."
                                        required
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2 text-sm rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Send Notification
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .glass-form {
                    background: rgba(30, 30, 30, 0.6);
                    backdrop-filter: blur(20px);
                }
            `}</style>
        </div>
    );
};

export default SendNotification;
