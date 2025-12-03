import './Login.css';
import React, { useContext, useState } from 'react';
import axios from '../../helpers/axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';


const Login: React.FC = () => {
    const auth = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/v1/login",
                { email, password },
            );

            if (res.status === 200) {
                if (auth) {
                    auth.dispatch({ type: 'LOGIN', payload: res.data });
                }
                setError(null);
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login to FMIIS</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input value={email} type="email" id="email" name="email" required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input value={password} type="password" id="password" name="password" required onChange={(e) => setPassword(e.target.value)} />
                        <span className='text-red-500'>{error}</span>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;



