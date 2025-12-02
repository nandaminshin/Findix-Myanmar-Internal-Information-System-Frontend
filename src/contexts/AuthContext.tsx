import { createContext, useReducer, useEffect, useState } from "react";
import { io, Socket } from 'socket.io-client';

// In AuthContext.ts
type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    image: string;
    // Add other user properties as needed
} | null;
type AuthState = {
    user: User;
};

type AuthAction =
    | { type: 'LOGIN'; payload: User }
    | { type: 'LOGOUT' };

type AuthContextValue = AuthState & {
    dispatch: React.Dispatch<AuthAction>;
    loading: boolean;
    socket: Socket | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            try {
                if (action.payload) localStorage.setItem('user', JSON.stringify(action.payload));
            } catch (e) {
                console.error('Failed to save user to localStorage', e);
            }
            return { ...state, user: action.payload };
        case 'LOGOUT':
            try {
                localStorage.removeItem('user');
            } catch (e) {
                console.error('Failed to remove user from localStorage', e);
            }
            return { ...state, user: null };
        default:
            return state;
    }
};

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(AuthReducer, { user: null });
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);

    // Initial auth check (guard localStorage usage)
    useEffect(() => {
        try {
            const stored = localStorage.getItem('user');
            if (stored) {
                const user = JSON.parse(stored);
                dispatch({ type: 'LOGIN', payload: user });
            } else {
                dispatch({ type: 'LOGOUT' });
            }
        } catch (e) {
            console.error('Failed to load user from localStorage', e);
            dispatch({ type: 'LOGOUT' });
        }
        setLoading(false);
    }, []);

    // Initialize socket on client only
    useEffect(() => {

        // Only initialize if running in browser and env var exists
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (typeof window === 'undefined' || !backendUrl) return;

        const s = io(backendUrl, {
            transports: ['websocket']
        });
        setSocket(s);

        s.on('connect', () => {
            console.log('Socket connected in AuthContext');
        });

        s.on('disconnect', () => {
            console.log('Socket disconnected in AuthContext');
        });

        return () => {
            s.off('connect');
            s.off('disconnect');
            s.disconnect();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading, socket }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };

