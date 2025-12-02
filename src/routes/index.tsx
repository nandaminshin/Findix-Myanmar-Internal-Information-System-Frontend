import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login.tsx";
import DevHome from "../pages/DevHome/DevHome.tsx";
import App from "../App.tsx";
import AuthNavigator from "../components/AuthNavigator.tsx";
import { AuthContext } from "../contexts/AuthContext.tsx";
import React, { useContext } from "react";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
    children: ReactNode;
    requireAuth?: boolean;
    allowedRoles?: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true, allowedRoles }) => {
    const auth = useContext(AuthContext);
    if (!auth) {
        // If no auth context is available, redirect to login
        return <Navigate to="/login" />;
    }

    const { user, loading } = auth;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (requireAuth && !user) {
        return <Navigate to="/login" />;
    }

    // if (allowedRoles && !allowedRoles.includes(user?.role)) {
    //     alert('You are not authorized to view this page');
    //     return <Navigate to="/" />;
    // }

    if (!requireAuth && user) {
        if (user.role === 'admin') return <Navigate to="/admin" />;
        if (user.role === 'superAdmin') return <Navigate to="/super-admin" />;
        if (user.role === 'user') return <Navigate to="/" />;
    }

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
            children: [
                {
                    index: true,
                    element: (
                        <ProtectedRoute requireAuth={true}>
                            <DevHome />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'login',
                    element: <Login />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default AppRoutes;