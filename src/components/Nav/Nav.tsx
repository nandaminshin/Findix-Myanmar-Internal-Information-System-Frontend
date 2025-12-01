import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, Settings, Menu } from 'lucide-react';
import './Nav.css';

interface NavProps {
  toggleSidebar: () => void;
}

const Nav: React.FC<NavProps> = ({ toggleSidebar }) => {
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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
          <span className="user-name">John Doe</span>
          <span className="user-role">Admin</span>
        </span>
      </div>
      <div className="navbar-right">
        <div className="notification-icon" ref={notificationRef} onClick={() => setNotificationDropdown(!notificationDropdown)}>
          <Bell size={20} />
          {notificationDropdown && (
            <div className="dropdown notification-dropdown">
              <ul>
                <li>Notification 1</li>
                <li>Notification 2</li>
                <li>Notification 3</li>
              </ul>
            </div>
          )}
        </div>
        <div className="profile-icon" ref={profileRef} onClick={() => setProfileDropdown(!profileDropdown)}>
          <User size={20} />
          {profileDropdown && (
            <div className="dropdown profile-dropdown">
              <ul>
                <li>
                  <Settings size={16} />
                  <span>Account</span>
                </li>
                <li>
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
