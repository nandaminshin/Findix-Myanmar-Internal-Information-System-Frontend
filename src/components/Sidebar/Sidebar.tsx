import React from 'react';
import { Home, BarChart2, Users, Settings, LogOut } from 'lucide-react';
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
                        <a href="#" className="sidebar-link">
                            <Home size={20} />
                            <span>Home</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="sidebar-link">
                            <BarChart2 size={20} />
                            <span>Analytics</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="sidebar-link">
                            <Users size={20} />
                            <span>Users</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="sidebar-link">
                            <Settings size={20} />
                            <span>Settings</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="sidebar-link">
                            <LogOut size={20} />
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;

