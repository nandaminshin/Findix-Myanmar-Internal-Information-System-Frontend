import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, CircleDollarSign, Bell, Users } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <aside className={`sidebar ${isOpen ? '' : 'closed'}`} aria-hidden={!isOpen}>
            <div className="sidebar-header">
                <img src="/images/transparent-logo.svg" alt="Findix Logo" />
            </div>
            {/* Close button visible on mobile */}
            <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
                ×
            </button>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/gm-md" end className="sidebar-link">
                            <Home size={20} />
                            <span>Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/gm-md/notifications" className="sidebar-link">
                            <Bell size={20} />
                            <span>Notifications</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/gm-md/leave-request" className="sidebar-link">
                            <FileText size={20} />
                            <span>Leave Request</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/gm-md/salary" className="sidebar-link">
                            <CircleDollarSign size={20} />
                            <span>Salary</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/gm-md/employee-management" className="sidebar-link">
                            <Users size={20} />
                            <span>Employee Management</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;

