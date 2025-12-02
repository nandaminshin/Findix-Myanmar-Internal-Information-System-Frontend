import React, { useState, useEffect } from 'react';
import Nav from "../../components/Nav/Nav";
import Sidebar from "../../components/Sidebar/Sidebar";
import './DevHome.css';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from "react";


const DevHome: React.FC = () => {
    // Initialize sidebar open state based on viewport width
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => (typeof window !== 'undefined' ? window.innerWidth >= 769 : true));
    const auth = useContext(AuthContext);
    const user = auth?.user;

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Keep sidebar responsive when crossing the breakpoint
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 769 && !sidebarOpen) setSidebarOpen(true);
            if (window.innerWidth < 769 && sidebarOpen) setSidebarOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [sidebarOpen]);

    return (
        <div className={`dev-home ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Nav toggleSidebar={toggleSidebar} />
            <main className="main-content">
                {/* Your main content goes here */}
                <h1>Welcome to Findix Myanmar Internal Information System {user?.name}</h1>
            </main>
        </div>
    )
}

export default DevHome;
