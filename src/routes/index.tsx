import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import DevHome from "../pages/Dev/DevHome/DevHome.tsx";
import App from "../App.tsx";
import DevApp from "../DevApp.tsx";
import GlobApp from "../GlobApp.tsx";
import GmApp from "../GmApp.tsx";
import HrApp from "../HrApp.tsx"
import AuthNavigator from "../components/AuthNavigator.tsx";
import { AuthContext } from "../contexts/AuthContext.tsx";
import React, { useContext } from "react";
import type { ReactNode } from "react";
import DevNoti from "../pages/Dev/DevNoti/DevNoti.tsx";
import DevLeaveRequest from "../pages/Dev/DevLeaveRequest/DevLeaveRequest.tsx";
import DevSalary from "../pages/Dev/DevSalary/DevSalary.tsx";
import GmHome from "../pages/Gm/GmHome/GmHome.tsx";
import EmpManagement from "../pages/Gm/EmpManagement/EmpManagement.tsx";
import CreateEmployee from "../pages/Gm/CreateEmployee/CreateEmployee.tsx";
import ManageSingleEmployee from "../pages/Gm/ManageSingleEmployee/ManageSingleEmployee.tsx";
import UpdateEmployee from "../pages/Gm/UpdateEmployee/UpdateEmployee.tsx";
import HrHome from "../pages/Hr/HrHome/HrHome.tsx";
import HrEmpManagement from "../pages/Hr/EmpManagement/EmpManagement.tsx";
import HrCreateEmployee from "../pages/Hr/CreateEmployee/CreateEmployee.tsx";
import HrManageSingleEmployee from "../pages/Hr/ManageSingleEmployee/ManageSingleEmployee.tsx";
import HrUpdateEmployee from "../pages/Hr/UpdateEmployee/UpdateEmployee.tsx";
import Notifications from "../pages/Hr/Notification/Notifications.tsx";
import SendNotification from "../pages/Hr/Notification/SendNotification.tsx";
import FullSingleNotification from "../pages/Hr/Notification/FullSingleNotification.tsx";

type ProtectedRouteProps = {
    children: ReactNode;
    requireAuth?: boolean;
    allowedRoles?: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true }) => {
    const auth = useContext(AuthContext);
    if (!auth) {
        // If no auth context is available, redirect to login
        return <Navigate to="/" />;
    }

    const { user, loading } = auth;

    if (loading) {
        return <div>Loading...</div>;
    }


    if (requireAuth && !user) {
        return <Navigate to="/" />;
    }

    // if (allowedRoles && !allowedRoles.includes(user?.role)) {
    //     alert('You are not authorized to view this page');
    //     return <Navigate to="/" />;
    // }

    // if (!requireAuth && user) {
    //     if (user.role === 'dev') return <Navigate to="/dev/home" />;
    //     if (user.role === 'superAdmin') return <Navigate to="/super-admin" />;
    //     if (user.role === 'user') return <Navigate to="/" />;
    // }

    return <>{children}</>;
};

const AppRoutes = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <AuthNavigator>
                    <App />
                </AuthNavigator>
            ),
            // children: [
            //     {
            //         path: '',
            //         element: < Login />
            //     }
            // ],
        },
        {
            path: '/dev',
            element: (
                <AuthNavigator>
                    <DevApp />
                </AuthNavigator>
            ),
            children: [
                {
                    path: '',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <DevHome />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'noti',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <DevNoti />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'leave-request',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <DevLeaveRequest />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'salary',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <DevSalary />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
        {
            path: '/glob',
            element: (
                <AuthNavigator>
                    <GlobApp />
                </AuthNavigator>
            ),
            children: [

            ],
        },
        {
            path: '/gm-md',
            element: (
                <AuthNavigator>
                    <GmApp />
                </AuthNavigator>
            ),
            children: [
                {
                    path: '',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <GmHome />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'employee-management',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <EmpManagement />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'create-new-employee',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <CreateEmployee />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'employee/:id',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <ManageSingleEmployee />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'update-employee/:id',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <UpdateEmployee />
                        </ProtectedRoute>
                    ),
                }
            ],
        },
        {
            path: '/hr',
            element: (
                <AuthNavigator>
                    <HrApp />
                </AuthNavigator>
            ),
            children: [
                {
                    path: '',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <HrHome />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'employee-management',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <HrEmpManagement />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'create-new-employee',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <HrCreateEmployee />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'employee/:id',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <HrManageSingleEmployee />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'update-employee/:id',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <HrUpdateEmployee />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'notifications',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <Notifications />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'notifications/send',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <SendNotification />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'notifications/:id',
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <FullSingleNotification />
                        </ProtectedRoute>
                    ),
                }
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default AppRoutes;