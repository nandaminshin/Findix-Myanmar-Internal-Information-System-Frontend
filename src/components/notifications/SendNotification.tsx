import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Users, Bell, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from '../../helpers/axios';

interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface Receiver {
    name: string;
    email: string;
    is_seen: boolean;
}

const notiTypes = [
    "Morning Meeting",
    "Developer Meeting",
    "Kosugi Meeting",
    "Emergency Meeting",
    "Internal Meeting",
    "General"
];

const contentTemplates: Record<string, string> = {
    "Morning Meeting": "Good morning team! This is a reminder for our morning meeting. Join the meeting at 8:30AM Yangon Time via this link - https://us02web.zoom.us/j/82024496813?pwd=SEZXOW9XUWNsSjUwY29oVFg3RXNXUT09",
    "Developer Meeting": "Hello developers! This is a notification for our developer meeting.Join the developer meeting at 11AM Yangon Time via this link - https://us02web.zoom.us/j/86453347948?pwd=QWhvNEdqNWdoY0RIM29PeUFva2JFUT09",
    "Kosugi Meeting": "Attention team! This is a notification for the Kosugi meeting.",
    "Emergency Meeting": "URGENT: Emergency meeting notification. Please attend immediately.",
    "Internal Meeting": "This is a notification for our internal meeting.",
    "General": "General notification for all team members."
};

const SendNotification: React.FC = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

    // Form state
    const [receiverType, setReceiverType] = useState<'role' | 'specific'>('role');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [receivers, setReceivers] = useState<Receiver[]>([]);
    const [selectedNotiType, setSelectedNotiType] = useState<string>('');
    const [content, setContent] = useState<string>('');

    // Fetch all employees on mount
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('/api/fmiis-backend/v001/get-all-employees');
                setEmployees(response.data.employees || []);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
    }, []);

    // Update receivers based on selection
    useEffect(() => {
        if (receiverType === 'role' && selectedRole) {
            let filteredEmployees: Employee[] = [];

            if (selectedRole === 'dev') {
                filteredEmployees = employees.filter(emp => emp.role === 'dev');
            } else if (selectedRole === 'glob') {
                filteredEmployees = employees.filter(emp => emp.role === 'glob');
            } else if (selectedRole === 'gm-md') {
                filteredEmployees = employees.filter(emp =>
                    (emp.role === 'gm' || emp.role === 'md') && emp.email !== auth?.user?.email
                );
            } else if (selectedRole === 'hr') {
                filteredEmployees = employees.filter(emp =>
                    emp.role === 'hr' && emp.email !== auth?.user?.email
                );
            }

            setReceivers(filteredEmployees.map(emp => ({
                name: emp.name,
                email: emp.email,
                is_seen: false
            })));
        } else if (receiverType === 'specific' && selectedEmployee) {
            const employee = employees.find(emp => emp.id === selectedEmployee);
            if (employee) {
                setReceivers([{
                    name: employee.name,
                    email: employee.email,
                    is_seen: false
                }]);
            }
        }
    }, [receiverType, selectedRole, selectedEmployee, employees, auth?.user?.email]);

    // Update content template when notification type changes
    useEffect(() => {
        if (selectedNotiType && step === 3) {
            setContent(contentTemplates[selectedNotiType] || '');
        }
    }, [selectedNotiType, step]);

    const handleNext = () => {
        if (step === 1 && receivers.length === 0) {
            alert('Please select receivers');
            return;
        }
        if (step === 2 && !selectedNotiType) {
            alert('Please select notification type');
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSend = async () => {
        if (!content.trim()) {
            alert('Please enter notification content');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                noti_type: selectedNotiType,
                sender: {
                    name: auth?.user?.name || '',
                    email: auth?.user?.email || '',
                    role: auth?.user?.role || ''
                },
                receivers: receivers,
                content: content
            };

            await axios.post('/api/fmiis-backend/v001/send-notification', payload);
            alert('Notification sent successfully!');
            navigate(`/${auth?.user?.role}/notifications`);
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    const availableEmployees = employees.filter(emp => emp.email !== auth?.user?.email);

    return (
        <div className="send-notification-page">
            <div className="main-content">
                <div className="p-6 md:p-8">
                    <div className="max-w-2xl mx-auto">
                        <button
                            onClick={() => navigate(`/${auth?.user?.role}/notifications`)}
                            className="mb-6 flex items-center gap-2 !bg-zinc-950 hover:!bg-zinc-900 !text-white !px-3 !py-1.5 !rounded-lg transition-all shadow-md hover:shadow-lg !font-medium !text-sm !border !border-zinc-800"
                        >
                            <ArrowLeft size={16} />
                            Back to Notifications
                        </button>

                        {/* Step 1: Receiver Selection */}
                        {step === 1 && (
                            <div className="glass-card animate-fade-in">
                                <div className="flex items-center gap-3 mb-6">
                                    <Users className="text-blue-400" size={24} />
                                    <h2 className="text-2xl font-bold text-white">Select Recipients</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Receiver Type Toggle */}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => { setReceiverType('role'); setSelectedEmployee(''); }}
                                            className={`flex-1 !px-2 !py-1 !rounded !text-xs font-medium transition-all border ${receiverType === 'role'
                                                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                                                : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                                                }`}
                                        >
                                            By Role
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setReceiverType('specific'); setSelectedRole(''); }}
                                            className={`flex-1 !px-2 !py-1 !rounded !text-xs font-medium transition-all border ${receiverType === 'specific'
                                                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                                                : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                                                }`}
                                        >
                                            Specific Employee
                                        </button>
                                    </div>

                                    {/* Role Selection */}
                                    {receiverType === 'role' && (
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-2">Select Role</label>
                                            <select
                                                value={selectedRole}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                className="w-full bg-zinc-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                                style={{ colorScheme: 'dark' }}
                                            >
                                                <option value="" className="bg-zinc-900 text-zinc-400">Choose a role...</option>
                                                <option value="dev" className="bg-zinc-900 text-white">Developers</option>
                                                <option value="glob" className="bg-zinc-900 text-white">Global Team</option>
                                                <option value="gm-md" className="bg-zinc-900 text-white">GM and MD</option>
                                                <option value="hr" className="bg-zinc-900 text-white">HR</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Specific Employee Selection */}
                                    {receiverType === 'specific' && (
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-400 mb-2">Select Employee</label>
                                            <select
                                                value={selectedEmployee}
                                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                                className="w-full bg-zinc-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                                style={{ colorScheme: 'dark' }}
                                            >
                                                <option value="" className="bg-zinc-900 text-zinc-400">Choose an employee...</option>
                                                {availableEmployees.map((emp) => (
                                                    <option key={emp.id} value={emp.id} className="bg-zinc-900 text-white">
                                                        {emp.name} ({emp.email}) - {emp.role.toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Selected Receivers Preview */}
                                    {receivers.length > 0 && (
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                            <p className="text-sm text-blue-300 font-medium mb-2">
                                                {receivers.length} recipient{receivers.length > 1 ? 's' : ''} selected
                                            </p>
                                            <div className="max-h-32 overflow-y-auto text-xs text-zinc-400 space-y-1">
                                                {receivers.slice(0, 5).map((receiver, idx) => (
                                                    <div key={idx}>{receiver.name} ({receiver.email})</div>
                                                ))}
                                                {receivers.length > 5 && (
                                                    <div className="text-blue-400">+{receivers.length - 5} more...</div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleNext}
                                        disabled={receivers.length === 0}
                                        className="w-full flex items-center justify-center gap-1 !bg-blue-600 hover:!bg-blue-500 disabled:!bg-zinc-700 disabled:cursor-not-allowed !text-white !px-2 !py-1 !rounded !text-xs font-medium transition-all"
                                        style={{
                                            backgroundColor: receivers.length === 0 ? 'rgb(63, 63, 70)' : 'rgb(37, 99, 235)',
                                            color: 'white'
                                        }}
                                    >
                                        Next
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Notification Type Selection */}
                        {step === 2 && (
                            <div className="glass-card animate-fade-in">
                                <div className="flex items-center gap-3 mb-6">
                                    <Bell className="text-purple-400" size={24} />
                                    <h2 className="text-2xl font-bold text-white">Select Notification Type</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {notiTypes.map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setSelectedNotiType(type)}
                                                className={`!p-2 !rounded !text-xs font-medium text-left transition-all border-2 ${selectedNotiType === type
                                                    ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/20'
                                                    : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                                style={{
                                                    backgroundColor: selectedNotiType === type ? 'rgba(147, 51, 234, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                                                    borderColor: selectedNotiType === type ? 'rgb(192, 132, 252)' : 'rgba(255, 255, 255, 0.1)',
                                                    color: selectedNotiType === type ? 'rgb(233, 213, 255)' : 'rgb(161, 161, 170)'
                                                }}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleBack}
                                            className="flex-1 flex items-center justify-center gap-1 !bg-white/5 hover:!bg-white/10 !text-white !px-2 !py-1 !rounded !text-xs font-medium transition-all border border-white/10"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                                color: 'white'
                                            }}
                                        >
                                            <ChevronLeft size={14} />
                                            Back
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={!selectedNotiType}
                                            className="flex-1 flex items-center justify-center gap-1 !bg-purple-600 hover:!bg-purple-500 disabled:!bg-zinc-700 disabled:cursor-not-allowed !text-white !px-2 !py-1 !rounded !text-xs font-medium transition-all"
                                            style={{
                                                backgroundColor: !selectedNotiType ? 'rgb(63, 63, 70)' : 'rgb(147, 51, 234)',
                                                color: 'white'
                                            }}
                                        >
                                            Next
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Content Editing */}
                        {step === 3 && (
                            <div className="glass-card animate-fade-in">
                                <div className="flex items-center gap-3 mb-6">
                                    <FileText className="text-green-400" size={24} />
                                    <h2 className="text-2xl font-bold text-white">Compose Message</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-400 mb-2">
                                            Notification Content
                                        </label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={6}
                                            className="w-full bg-zinc-900/80 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-green-500/50 transition-all resize-none"
                                            placeholder="Enter your notification message..."
                                        />
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Type:</span>
                                            <span className="text-white font-medium">{selectedNotiType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Recipients:</span>
                                            <span className="text-white font-medium">{receivers.length}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleBack}
                                            className="flex-1 flex items-center justify-center gap-1 !bg-white/5 hover:!bg-white/10 !text-white !px-2 !py-1 !rounded !text-xs font-medium transition-all border border-white/10"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                                color: 'white'
                                            }}
                                        >
                                            <ChevronLeft size={14} />
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSend}
                                            disabled={loading || !content.trim()}
                                            className="flex-1 flex items-center justify-center gap-1 !bg-gradient-to-r !from-green-600 !to-emerald-600 hover:!from-green-500 hover:!to-emerald-500 disabled:!from-zinc-700 disabled:!to-zinc-700 disabled:cursor-not-allowed !text-white !px-2 !py-1 !rounded !text-xs font-medium transition-all shadow-lg"
                                            style={{
                                                background: (loading || !content.trim()) ? 'rgb(63, 63, 70)' : 'linear-gradient(to right, rgb(22, 163, 74), rgb(16, 185, 129))',
                                                color: 'white'
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={14} />
                                                    Send Notification
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .glass-card {
                    background: rgba(30, 30, 30, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 2rem;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }

                @media (max-width: 640px) {
                    .glass-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default SendNotification;
