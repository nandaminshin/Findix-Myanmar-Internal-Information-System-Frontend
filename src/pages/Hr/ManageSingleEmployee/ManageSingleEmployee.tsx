import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../helpers/axios';
import { ArrowLeft, User, Check, Mail, Hash } from 'lucide-react';
import NotFoundInline from '../../../components/NotFoundInline/NotFoundInline';
import './ManageSingleEmployee.css';

interface FamilyInfo {
    dad: boolean;
    dad_allowance: boolean;
    mom: boolean;
    mom_allowance: boolean;
    spouse_allowance: boolean;
    child: number;
}

interface LeaveInfo {
    remaining_casual_leave: number;
    remaining_earned_leave: number;
    remaining_medical_leave: number;
    remaining_special_leave: number;
    unpaid_leave: number;
    prepaid_leave: number;
}

interface Employee {
    id: string;
    name: string;
    emp_no: string;
    role: string;
    email: string;
    phone: string;
    address: string;
    emergency_address: string;
    emergency_phone: string;
    nrc: string;
    graduated_uni: string;
    salary: number;
    birthday: string;
    date_of_hire: string;
    date_of_retirement: string;
    created_at: string;
    updated_at: string;
    image?: string | null;
    note: string;
    family_info: FamilyInfo;
    leave_info?: LeaveInfo;
}

const ManageSingleEmployee: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteSecretCode, setDeleteSecretCode] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`/api/fmiis-backend/v001/get-single-employee/${id}`, {
                    params: { _t: new Date().getTime() }
                });
                console.log("Single Employee API Response:", response.data);

                if (response.data && response.data.employee) {
                    setEmployee(response.data.employee);
                } else if (response.data && response.data.data) {
                    setEmployee(response.data.data);
                } else {
                    setEmployee(response.data);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching employee:', err);
                setError('Failed to fetch employee details');
                setLoading(false);
            }
        };

        if (id) {
            fetchEmployee();
        }
    }, [id]);

    const handleUpdate = () => {
        navigate(`/hr/update-employee/${id}`);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
        setDeleteSecretCode('');
    };

    const confirmDelete = async () => {
        if (!deleteSecretCode) return;

        setIsDeleting(true);
        try {
            // Using standard REST DELETE with body
            await axios.delete(`/api/fmiis-backend/v001/delete/${id}`, {
                data: { secret_code: deleteSecretCode },
            });

            alert('Employee deleted successfully');
            navigate('/hr/employee-management');
        } catch (err: any) {
            console.error("Delete error:", err);
            if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.error || err.response?.data?.message || "Failed to delete employee";
                alert(msg);
            } else {
                alert("An unexpected error occurred");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString || dateString.startsWith('1970')) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const CheckboxDisplay = ({ label, checked }: { label: string, checked: boolean }) => (
        <div className="checkbox-display">
            <div className={`checkbox-indicator ${checked ? 'checked' : 'unchecked'}`}>
                {checked && <Check size={12} strokeWidth={3} />}
            </div>
            <span className="text-sm text-gray-300">{label}</span>
        </div>
    );

    if (loading) {
        return (
            <div className="manage-single-employee-page flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="manage-single-employee-page">
                <div className="main-content">
                    <NotFoundInline
                        title="Employee Not Found"
                        message={error || "The employee you're looking for doesn't exist or may have been removed."}
                        backPath="/hr/employee-management"
                        showImage={true}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="manage-single-employee-page relative">
            <div className="main-content">
                <div className="max-w-5xl mx-auto pb-12">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate('/hr/employee-management')}
                            className="flex items-center gap-2 !bg-zinc-950 hover:!bg-zinc-900 !text-white !px-3 !py-1.5 !rounded-lg transition-all shadow-md hover:shadow-lg !font-medium !text-sm !border !border-zinc-800"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Manage Employee</h1>
                            <p className="text-gray-400 text-sm">View and manage details for {employee.name}</p>
                        </div>
                    </div>

                    <div className="glass-widget animate-in fade-in duration-500">
                        <div className="flex flex-col md:flex-row gap-8 mb-8 border-b border-white/10 pb-8">
                            {/* Profile Image */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center shadow-2xl">
                                    {employee.image ? (
                                        <img
                                            src={`${employee.image}?v=${new Date(employee.updated_at).getTime()}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <User size={48} className="opacity-50" />
                                            <span className="text-xs font-medium">No image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Header Info */}
                            <div className="flex-grow flex flex-col justify-center">
                                <h2 className="text-3xl font-bold text-white mb-2">{employee.name}</h2>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium border border-blue-500/30 uppercase tracking-wide">
                                        {employee.role}
                                    </span>
                                    <span className="px-3 py-1 bg-white/5 text-gray-300 rounded-lg text-sm border border-white/10 flex items-center gap-2">
                                        <Hash size={14} />
                                        {employee.emp_no}
                                    </span>
                                    <span className="px-3 py-1 bg-white/5 text-gray-300 rounded-lg text-sm border border-white/10 flex items-center gap-2">
                                        <Mail size={14} />
                                        {employee.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                            {/* Personal Information */}
                            <section>
                                <h3 className="section-title">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="info-label">Phone</label>
                                        <div className="info-value">{employee.phone}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">Date of Birth</label>
                                        <div className="info-value">{formatDate(employee.birthday)}</div>
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="info-label">Address</label>
                                        <div className="info-value">{employee.address}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">NRC Number</label>
                                        <div className="info-value">{employee.nrc}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">Info Created At</label>
                                        <div className="info-value text-xs text-gray-400">{new Date(employee.created_at).toLocaleString()}</div>
                                    </div>
                                </div>
                            </section>

                            {/* Job Details */}
                            <section>
                                <h3 className="section-title">Job Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="info-label">Job Role</label>
                                        <div className="info-value uppercase">{employee.role}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">Salary</label>
                                        <div className="info-value">{employee.salary?.toLocaleString()} MMK</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">Date of Hire</label>
                                        <div className="info-value">{formatDate(employee.date_of_hire)}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">Retirement Date</label>
                                        <div className="info-value">{formatDate(employee.date_of_retirement)}</div>
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="info-label">Graduated University</label>
                                        <div className="info-value">{employee.graduated_uni}</div>
                                    </div>
                                </div>
                            </section>

                            {/* Emergency Contact */}
                            <section>
                                <h3 className="section-title">Emergency Contact</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                        <label className="info-label">Emergency Phone</label>
                                        <div className="info-value">{employee.emergency_phone}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">Emergency Address</label>
                                        <div className="info-value">{employee.emergency_address}</div>
                                    </div>
                                </div>
                            </section>

                            {/* Family Information */}
                            <section>
                                <h3 className="section-title">Family Information</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <CheckboxDisplay label="Father" checked={employee.family_info?.dad} />
                                        <CheckboxDisplay label="Father Allowance" checked={employee.family_info?.dad_allowance} />
                                        <CheckboxDisplay label="Mother" checked={employee.family_info?.mom} />
                                        <CheckboxDisplay label="Mother Allowance" checked={employee.family_info?.mom_allowance} />
                                        <CheckboxDisplay label="Spouse Allowance" checked={employee.family_info?.spouse_allowance} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">Number of Children</label>
                                        <div className="info-value w-24 justify-center">{employee.family_info?.child}</div>
                                    </div>
                                </div>
                            </section>

                            {/* Leave Information */}
                            <section>
                                <h3 className="section-title">Leave Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="info-label">Casual Leave</label>
                                        <div className="info-value">{employee.leave_info?.remaining_casual_leave ?? '-'}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">Earned Leave</label>
                                        <div className="info-value">{employee.leave_info?.remaining_earned_leave ?? '-'}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">Medical Leave</label>
                                        <div className="info-value">{employee.leave_info?.remaining_medical_leave ?? '-'}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">Special Leave</label>
                                        <div className="info-value">{employee.leave_info?.remaining_special_leave ?? '-'}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">Unpaid Leave</label>
                                        <div className="info-value">{employee.leave_info?.unpaid_leave ?? '-'}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="info-label">Prepaid Leave</label>
                                        <div className="info-value">{employee.leave_info?.prepaid_leave ?? '-'}</div>
                                    </div>
                                </div>
                            </section>

                            {/* Additional Note */}
                            {employee.note && (
                                <section className="lg:col-span-2">
                                    <h3 className="section-title">Additional Note</h3>
                                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm whitespace-pre-wrap">
                                        {employee.note}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-white/10">
                            <button
                                onClick={handleDelete}
                                className="compact-btn btn-danger"
                            >
                                Delete Employee
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="compact-btn btn-white"
                            >
                                Update Information
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {
                showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                            <h3 className="text-xl font-bold text-white mb-2">Delete Employee</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Are you sure you want to delete <span className="text-white font-medium">{employee.name}</span>?
                                This action cannot be undone.
                            </p>

                            <div className="mb-6">
                                <label className="text-xs text-gray-500 font-medium mb-1.5 block">ENTER SECRET CODE</label>
                                <input
                                    type="password"
                                    value={deleteSecretCode}
                                    onChange={(e) => setDeleteSecretCode(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                    placeholder="Enter code to confirm"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="!px-3 !py-1.5 !rounded-lg !bg-zinc-800 !hover:bg-zinc-700 !text-zinc-400 !hover:text-white !transition-colors !text-xs !font-medium !border !border-zinc-700/50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting || !deleteSecretCode}
                                    className="flex justify-center !px-3 !py-1.5 !rounded-lg !bg-red-500/10 !hover:bg-red-500/20 !text-red-500 !border !border-red-500/20 !transition-colors !text-xs !font-medium !disabled:opacity-50 !disabled:cursor-not-allowed !flex !items-center !gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        'Confirm Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ManageSingleEmployee;
