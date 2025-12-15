import './App.css'
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Dev/Sidebar/Sidebar';
import Nav from './components/Dev/Nav/Nav';
import { useState, useEffect } from 'react';

function DevApp() {

    // Initialize sidebar open state based on viewport width
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => (typeof window !== 'undefined' ? window.innerWidth >= 769 : true));

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
            <Outlet />
        </div>
    )
}

export default DevApp
