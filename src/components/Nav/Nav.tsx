import React, { useState, useRef, useEffect, useContext } from 'react';
import { Bell, User, LogOut, Settings, Menu } from 'lucide-react';
import './Nav.css';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface NavProps {
    toggleSidebar: () => void;
}

const Nav: React.FC<NavProps> = ({ toggleSidebar }) => {
    const [notificationDropdown, setNotificationDropdown] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);

    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const auth = useContext(AuthContext);
    const user = auth?.user;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await axios.post("/api/v1/logout", {},);
            if (res.status === 200) {
                if (auth) {
                    auth.dispatch({ type: 'LOGOUT' });
                    console.log('Logout successful');
                    navigate('/login');
                }
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }

    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationDropdown(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="hamburger" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <span className="user-info">
                    <span className="user-name">{user?.name}</span>
                    <span className="user-role">{user?.role}</span>
                </span>
            </div>
            <div className="navbar-right">
                <div className="notification-icon" ref={notificationRef} onClick={() => setNotificationDropdown(!notificationDropdown)}>
                    <Bell size={20} />
                    {notificationDropdown && (
                        <div className="dropdown notification-dropdown">
                            <ul>
                                <li role="button" tabIndex={0} onClick={() => { /* notification 1 click */ }}>Notification 1</li>
                                <li role="button" tabIndex={0} onClick={() => { /* notification 2 click */ }}>Notification 2</li>
                                <li role="button" tabIndex={0} onClick={() => { /* notification 3 click */ }}>Notification 3</li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="profile-icon" ref={profileRef} onClick={() => setProfileDropdown(!profileDropdown)}>
                    <User size={20} />
                    {profileDropdown && (
                        <div className="dropdown profile-dropdown">
                            <ul>
                                <li onClick={() => { /* account click */ }}>
                                    <Settings size={16} />
                                    <span>Account</span>
                                </li>
                                <li onClick={() => { handleLogout() }}>
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
