import { AuthContext } from '../contexts/AuthContext'
import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "../helpers/axios";


const AuthNavigator = ({ children }: { children: React.ReactNode }) => {
    const auth = useContext(AuthContext);
    const user = auth?.user ?? null;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            const run = async () => {
                try {
                    await axios.get("/api/fmiis-backend/v001/auth/me");
                } catch {
                    return;
                }

                if (user.role === 'dev' && !location.pathname.startsWith('/dev')) {
                    navigate('/dev');
                } else if (user.role === 'glob' && !location.pathname.startsWith('/glob')) {
                    navigate('/glob');

                } else if (user.role === 'gm' && !location.pathname.startsWith('/gm-md')) {
                    navigate('/gm-md');

                } else if (user.role === 'md' && !location.pathname.startsWith('/gm-md')) {
                    navigate('/gm-md');

                } else if (user.role === 'hr' && !location.pathname.startsWith('/hr')) {
                    navigate('/hr');

                } else if ((user.role !== 'gm' && user.role !== 'md') && location.pathname.startsWith('/gm-md')) {
                    navigate('/');
                } else if (user.role !== 'hr' && location.pathname.startsWith('/hr')) {
                    navigate('/');
                }
            }
            run();
        }
    }, [user, navigate, location.pathname]);
    return children
}

export default AuthNavigator
