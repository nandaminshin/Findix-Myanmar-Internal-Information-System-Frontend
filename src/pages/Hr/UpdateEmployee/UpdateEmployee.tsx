import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, ArrowLeft, Calendar as CalendarIcon, User, Upload } from 'lucide-react';
import axios from '../../../helpers/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from "date-fns"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from '../../../contexts/AuthContext';
import { useContext } from 'react';

import './UpdateEmployee.css';

interface FamilyInfo {
    dad: boolean;
    dad_allowance: boolean;
    mom: boolean;
    mom_allowance: boolean;
    spouse_allowance: boolean;
    child: number;
}

interface EmployeeForm {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    secret_code: string;
    emp_no: string;
    birthday: Date | undefined;
    date_of_hire: Date | undefined;
    salary: number;
    date_of_retirement: Date | undefined;
    nrc: string;
    graduated_uni: string;
    address: string;
    emergency_address: string;
    emergency_phone: string;
    family_info: FamilyInfo;
    note: string;
    image?: string
}

const UpdateEmployee: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newImage, setNewImage] = useState<boolean>(false);

    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const auth = useContext(AuthContext);

    // Initial Form State
    const initialFormState: EmployeeForm = {
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'dev',
        secret_code: '',
        emp_no: '',
        birthday: undefined,
        date_of_hire: undefined,
        salary: 0,
        date_of_retirement: undefined,
        nrc: '',
        graduated_uni: '',
        address: '',
        emergency_address: '',
        emergency_phone: '',
        family_info: {
            dad: false,
            dad_allowance: false,
            mom: false,
            mom_allowance: false,
            spouse_allowance: false,
            child: 0
        },
        note: '',
        image: ''
    };

    const [formData, setFormData] = useState<EmployeeForm>(initialFormState);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!id) return;
            try {
                const response = await axios.get(`/api/fmiis-backend/v001/get-single-employee/${id}`);
                const emp = response.data.employee;

                if (emp) {
                    setFormData({
                        name: emp.name || '',
                        email: emp.email || '',
                        phone: emp.phone || '',
                        password: emp.password || '', // Pre-fill password if available
                        role: emp.role || 'dev',
                        secret_code: emp.secret_code || '',
                        emp_no: emp.emp_no || '',
                        birthday: emp.birthday ? new Date(emp.birthday) : undefined,
                        date_of_hire: emp.date_of_hire ? new Date(emp.date_of_hire) : undefined,
                        salary: emp.salary || 0,
                        date_of_retirement: emp.date_of_retirement ? new Date(emp.date_of_retirement) : undefined,
                        nrc: emp.nrc || '',
                        graduated_uni: emp.graduated_uni || '',
                        address: emp.address || '',
                        emergency_address: emp.emergency_address || '',
                        emergency_phone: emp.emergency_phone || '',
                        family_info: emp.family_info || initialFormState.family_info,
                        note: emp.note || '',
                        image: emp.image || ''
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching employee:', err);
                setError('Failed to fetch employee details');
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (name.startsWith('family_info.')) {
            const familyField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                family_info: {
                    ...prev.family_info,
                    [familyField]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseInt(value) : value)
                }
            }));
        } else if (type === 'date' && name === 'date_of_retirement' && value === '') {
            setFormData(prev => ({
                ...prev,
                [name]: new Date('')
            }));
        } else if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: parseInt(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
            }));
        }
    };

    const handleDateSelect = (date: Date | null, field: keyof EmployeeForm) => {
        setFormData(prev => ({
            ...prev,
            [field]: date
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                setSelectedImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        image: reader.result as string
                    }));
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please upload only JPG or PNG files.');
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
        setNewImage(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setError('');

        try {
            // 1. Upload image FIRST if selected
            let finalImagePath = formData.image;

            if (selectedImageFile && id) {
                const imageFormData = new FormData();
                imageFormData.append('profile_image', selectedImageFile);

                console.log("Uploading profile image first...");
                // Using the specific endpoint provided by user
                const uploadRes = await axios.post(`/api/fmiis-backend/v001/upload-avatar/${id}`, imageFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (uploadRes.data && uploadRes.data.path) {
                    finalImagePath = uploadRes.data.path;
                    console.log("Image uploaded, new path:", finalImagePath);
                }
            }

            // 2. Update text info using the (potentially new) image path
            const payload = {
                id: id,
                ...formData,
                image: finalImagePath, // Pass the string path (old or new) to the update endpoint
                birthday: formData.birthday ? format(formData.birthday, "yyyy-MM-dd") : '',
                date_of_hire: formData.date_of_hire ? format(formData.date_of_hire, "yyyy-MM-dd") : '',
                date_of_retirement: formData.date_of_retirement ? format(formData.date_of_retirement, "yyyy-MM-dd") : '',
            };

            console.log("Submitting update payload...", payload);
            await axios.post(`/api/fmiis-backend/v001/gm-update/${id}`, payload);

            alert('Employee updated successfully!');
            if (auth?.user?.id == id) {
                await auth?.dispatch({
                    type: 'UPDATE', payload: {
                        id: id!,
                        name: formData.name,
                        email: formData.email,
                        role: formData.role,
                        image: finalImagePath!,
                    }
                });
                navigate(`/hr/employee/${id}`);
            } else {
                navigate(`/hr/employee/${id}`);
            }

        } catch (err: any) {
            console.error("Error updating employee:", err);
            console.log("Current Base URL:", axios.defaults.baseURL);

            if (axios.isAxiosError(err)) {
                const backendError = err.response?.data?.error;

                if (err.code === "ERR_NETWORK") {
                    alert("Network Error: Check console for CORS or URL issues. BaseURL: " + axios.defaults.baseURL);
                }

                if (backendError) {
                    setError(backendError);
                } else {
                    setError(err.message);
                }
            } else {
                setError("Unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="update-employee-page flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="update-employee-page">
            <div className="main-content">
                <div className="max-w-4xl mx-auto update-emp-container">
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => navigate(`/hr/employee/${id}`)} className="flex items-center gap-2 !bg-zinc-950 hover:!bg-zinc-900 !text-white !px-3 !py-1.5 !rounded-lg transition-all shadow-md hover:shadow-lg !font-medium !text-sm !border !border-zinc-800">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Update Employee</h1>
                            <p className="text-gray-400 text-sm">Update details for {formData.name}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="glass-panel space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                        {/* Profile Image - New Section */}
                        <div className="flex flex-col items-center gap-4 py-4 border-b border-white/10">
                            <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 bg-zinc-900 flex items-center justify-center">
                                    {formData.image && !newImage ? (
                                        <img src={import.meta.env.VITE_BACKEND_URL + formData.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : formData.image ? (
                                        <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={64} className="text-gray-500" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload className="text-white" size={24} />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/jpeg,image/png"
                                className="hidden"
                            />
                        </div>

                        {/* Personal Information */}
                        <section>
                            <h3 className="section-title">Personal Information</h3>
                            <span className="text-red-500 py-2">{error}</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Full Name</label>
                                    <input required name="name" value={formData.name} onChange={handleInputChange} className="form-input-compact" placeholder="e.g. Thin Thin Hitke" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Email</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input-compact" placeholder="email@company.com" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Phone</label>
                                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className="form-input-compact" placeholder="09..." />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Detail Address</label>
                                    <input required name="address" value={formData.address} onChange={handleInputChange} className="form-input-compact" placeholder="Full Address" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">NRC Number</label>
                                    <input required name="nrc" value={formData.nrc} onChange={handleInputChange} className="form-input-compact" placeholder="x/XXX(N)xxxxxx" />
                                </div>


                                <div className="space-y-1.5 relative">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Date of Birth</label>
                                    <div className="relative w-full">
                                        <DatePicker
                                            selected={formData.birthday}
                                            onChange={(date) => handleDateSelect(date, 'birthday')}
                                            dateFormat="dd/MM/yyyy"
                                            className="form-input-compact w-full pl-3 pr-10"
                                            placeholderText="DD/MM/YYYY"
                                            showYearDropdown
                                            scrollableYearDropdown
                                            yearDropdownItemNumber={100}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <CalendarIcon size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Job Details */}
                        <section>
                            <h3 className="section-title">Job Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Role</label>
                                    <select name="role" value={formData.role} onChange={handleInputChange} className="form-input-compact cursor-pointer">
                                        <option value="dev">Developer</option>
                                        <option value="hr">HR</option>
                                        <option value="gm">GM</option>
                                        <option value="md">MD</option>
                                        <option value="glob">Global</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Employee ID</label>
                                    <input required name="emp_no" value={formData.emp_no} onChange={handleInputChange} className="form-input-compact" placeholder="FM_xxxxx" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Date of Hire</label>
                                    <div className="relative w-full">
                                        <DatePicker
                                            selected={formData.date_of_hire}
                                            onChange={(date) => handleDateSelect(date, 'date_of_hire')}
                                            dateFormat="dd/MM/yyyy"
                                            className="form-input-compact w-full pl-3 pr-10"
                                            placeholderText="DD/MM/YYYY"
                                            showYearDropdown
                                            scrollableYearDropdown
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <CalendarIcon size={16} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Salary</label>
                                    <input required type="number" name="salary" value={formData.salary} onChange={handleInputChange} className="form-input-compact" placeholder="" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Graduated University</label>
                                    <input required name="graduated_uni" value={formData.graduated_uni} onChange={handleInputChange} className="form-input-compact" placeholder="University Name" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Retirement Date</label>
                                    <div className="relative w-full">
                                        <DatePicker
                                            selected={formData.date_of_retirement}
                                            onChange={(date) => handleDateSelect(date, 'date_of_retirement')}
                                            dateFormat="dd/MM/yyyy"
                                            className="form-input-compact w-full pl-3 pr-10"
                                            placeholderText="DD/MM/YYYY"
                                            showYearDropdown
                                            scrollableYearDropdown
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <CalendarIcon size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Emergency Contact */}
                        <section>
                            <h3 className="section-title">Emergency Contact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Emergency Address</label>
                                    <input required name="emergency_address" value={formData.emergency_address} onChange={handleInputChange} className="form-input-compact" placeholder="Address" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Emergency Phone</label>
                                    <input required name="emergency_phone" value={formData.emergency_phone} onChange={handleInputChange} className="form-input-compact" placeholder="Phone" />
                                </div>
                            </div>
                        </section>

                        {/* Family Info */}
                        <section>
                            <h3 className="section-title">Family Information</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" name="family_info.dad" checked={formData.family_info.dad} onChange={handleInputChange} className="cursor-pointer w-4 h-4 rounded border-gray-600" />
                                    <span className="text-xs text-gray-300 group-hover:text-white transition-colors">Father</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" name="family_info.dad_allowance" checked={formData.family_info.dad_allowance} onChange={handleInputChange} className="cursor-pointer w-4 h-4 rounded border-gray-600" />
                                    <span className="text-xs text-gray-300 group-hover:text-white transition-colors">Father Allowance</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" name="family_info.mom" checked={formData.family_info.mom} onChange={handleInputChange} className="cursor-pointer w-4 h-4 rounded border-gray-600" />
                                    <span className="text-xs text-gray-300 group-hover:text-white transition-colors">Mother</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" name="family_info.mom_allowance" checked={formData.family_info.mom_allowance} onChange={handleInputChange} className="cursor-pointer w-4 h-4 rounded border-gray-600" />
                                    <span className="text-xs text-gray-300 group-hover:text-white transition-colors">Mother Allowance</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" name="family_info.spouse_allowance" checked={formData.family_info.spouse_allowance} onChange={handleInputChange} className="cursor-pointer w-4 h-4 rounded border-gray-600" />
                                    <span className="text-xs text-gray-300 group-hover:text-white transition-colors">Spouse Allowance</span>
                                </label>
                            </div>
                            <div className="w-full md:w-1/3">
                                <label className="text-xs text-gray-400 font-medium ml-1">Number of Children</label>
                                <input type="number" name="family_info.child" value={formData.family_info.child} onChange={handleInputChange} className="form-input-compact mt-1" min="0" />
                            </div>
                        </section>

                        {/* Security & System */}
                        <section>
                            <h3 className="section-title">Security & Access</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Password</label>
                                    <div className="relative">
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Password"
                                            className="form-input-compact !pr-10"
                                            style={{ paddingRight: '2.5rem' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="!absolute !right-2 !top-1/2 !-translate-y-1/2 !text-gray-400 hover:!text-white transition-colors !p-1 !bg-transparent !border-0"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1">Leave unchanged to keep current password (if pre-filled)</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Secret Code</label>
                                    <input required name="secret_code" value={formData.secret_code} onChange={handleInputChange} className="form-input-compact" placeholder="Only for GM/MD/HR" />
                                </div>
                            </div>
                        </section>

                        {/* Additional Note */}
                        <section>
                            <label className="text-xs text-gray-400 font-medium ml-1">Additional Note</label>
                            <textarea name="note" value={formData.note} onChange={handleInputChange} className="form-input-compact mt-1 h-20 resize-none" placeholder="Any extra information..."></textarea>
                        </section>

                        <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                            <button type="button" onClick={() => navigate(`/hr/employee/${id}`)} className="compact-btn btn-secondary" disabled={isSubmitting}>Cancel</button>
                            <button type="submit" className="compact-btn btn-white items-center gap-2" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Employee'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateEmployee;
