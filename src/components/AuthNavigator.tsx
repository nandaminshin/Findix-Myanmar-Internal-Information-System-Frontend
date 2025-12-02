import { AuthContext } from '../contexts/AuthContext'
import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthNavigator = ({ children }: { children: React.ReactNode }) => {
    const auth = useContext(AuthContext);
    const user = auth?.user ?? null;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            // if (user.role === 'dev' && !location.pathname.startsWith('/dev')) {
            //     navigate('/dev/home');
            // } else if (user.role === 'superAdmin' && !location.pathname.startsWith('/super-admin')) {
            //     navigate('/super-admin');

            // } else if (user.role !== 'admin' && location.pathname.startsWith('/admin')) {
            //     navigate('/');
            // }
            navigate('/');
        }
    }, [user, navigate, location.pathname]);
    return children
}

export default AuthNavigator
