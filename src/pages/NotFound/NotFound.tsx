import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const getHomePath = () => {
        if (!auth?.user) return '/';

        const role = auth.user.role;
        if (role === 'dev') return '/dev';
        if (role === 'gm' || role === 'md') return '/gm-md';
        if (role === 'hr') return '/hr';
        return '/';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
            <div className="max-w-2xl w-full">
                {/* Glass Panel */}
                <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl bg-white/[0.02]">
                    {/* Spanish Guy Image */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <img
                                src="/images/spanish-guy.png"
                                alt="404 Not Found"
                                className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl animate-float"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent blur-3xl -z-10"></div>
                        </div>
                    </div>

                    {/* Error Message */}
                    <div className="text-center space-y-4 mb-8">
                        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            404
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                            Page Not Found
                        </h2>
                        <p className="text-zinc-400 text-base md:text-lg max-w-md mx-auto">
                            Oops! The page you're looking for doesn't exist or has been moved.
                            Let's get you back on track.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate(getHomePath())}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                        >
                            <Home size={20} />
                            Go to Home
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-zinc-500 text-sm">
                            Error Code: 404 | Page Not Found
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .glass-panel {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                @media (max-width: 640px) {
                    .glass-panel {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default NotFound;
