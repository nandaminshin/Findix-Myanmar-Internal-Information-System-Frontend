import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './EmpManagement.css';
import { socket } from '../../../lib/socket';
import axios from '../../../helpers/axios';

const EmpManagement: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [employees, setEmployees] = useState<any[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/fmiis-backend/v001/get-all-employees');
            console.log("Employees API Response:", response.data);
            let data = response.data.employees;

            // Handle potential wrapper objects
            // if (!Array.isArray(data)) {
            //     if (data.data && Array.isArray(data.data)) {
            //         data = data.data;
            //     } else if (data.employees && Array.isArray(data.employees)) {
            //         data = data.employees;
            //     } else {
            //         console.warn("Unexpected API response format, expected array:", data);
            //         data = [];
            //     }
            // }

            setEmployees(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError('Failed to fetch employees');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();

        // Listen for real-time updates
        socket.on("employee_created", () => {
            console.log("📡 Employee created event received");
            fetchEmployees();
        });

        return () => {
            socket.off("employee_created");
        };
    }, []);

    return (
        <div className="emp-management-page">
            <div className="main-content">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="page-title">Employee Management</h1>
                        <p className="page-subtitle">Manage your organization's workforce and access controls</p>
                    </div>
                    <button
                        onClick={() => navigate('/gm-md/create-new-employee')}
                        className="flex items-center gap-2 !bg-zinc-950 hover:!bg-zinc-900 !text-white !px-3 !py-1.5 !rounded-lg transition-all shadow-md hover:shadow-lg !font-medium !text-sm !border !border-zinc-800"
                    >
                        <Plus size={16} />
                        Create New Employee
                    </button>
                </div>

                {/* List Section */}
                <div className="glass-widget">
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="search-input-glass w-full pl-9 pr-4 py-2 rounded-lg text-sm"
                            />
                        </div>
                    </div>
                    <span className='text-red-500'>{error}</span>

                    <div className="overflow-x-auto">
                        <table className="emp-table">
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Role</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Join Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td className="w-1/4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md text-sm">
                                                {employee.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white text-sm">{employee.name}</div>
                                                <div className="text-xs text-gray-400">{employee.emp_no}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs font-medium border border-blue-500/30">{employee.role}</span>
                                    </td>
                                    <td className="text-sm font-medium">{employee.email}</td>
                                    <td className="text-sm">{employee.phone}</td>
                                    <td className="text-sm"> {new Date(employee.date_of_hire).toLocaleDateString("en-GB")}</td>
                                    <td>
                                        <button className="!text-gray-400 hover:!text-white transition-colors !text-xs !font-medium !bg-white/5 !px-2 !py-1 !rounded hover:!bg-white/10 active:!bg-white/20" onClick={() => navigate(`/gm-md/employee/${employee.id}`)}>
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpManagement;
