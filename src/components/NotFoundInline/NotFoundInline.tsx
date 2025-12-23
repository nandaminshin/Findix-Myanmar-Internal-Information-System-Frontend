import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

interface NotFoundInlineProps {
    title?: string;
    message?: string;
    backPath?: string;
    backLabel?: string;
    showImage?: boolean;
}

const NotFoundInline: React.FC<NotFoundInlineProps> = ({
    title = "Not Found",
    message = "The resource you're looking for doesn't exist or has been removed.",
    backPath,
    backLabel = "Go Back",
    showImage = false
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <div className="max-w-md w-full text-center">
                {showImage && (
                    <div className="flex justify-center mb-6">
                        <img
                            src="/images/spanish-guy.png"
                            alt="Not Found"
                            className="w-32 h-32 object-contain opacity-50"
                        />
                    </div>
                )}

                <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
                <p className="text-zinc-400 mb-6">{message}</p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all border border-white/10 hover:border-white/20"
                    >
                        <ArrowLeft size={18} />
                        {backLabel}
                    </button>
                    {backPath && (
                        <button
                            onClick={() => navigate(backPath)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all"
                        >
                            <Home size={18} />
                            Go to List
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotFoundInline;
