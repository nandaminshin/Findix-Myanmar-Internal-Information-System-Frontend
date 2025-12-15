import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, CircleDollarSign, Bell } from 'lucide-react';
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
                        <NavLink to="/dev" end className="sidebar-link">
                            <Home size={20} />
                            <span>Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dev/noti" className="sidebar-link">
                            <Bell size={20} />
                            <span>Notifications</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dev/leave-request" className="sidebar-link">
                            <FileText size={20} />
                            <span>Leave Request</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dev/salary" className="sidebar-link">
                            <CircleDollarSign size={20} />
                            <span>Salary</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;

