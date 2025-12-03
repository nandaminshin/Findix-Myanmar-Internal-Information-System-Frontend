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

// Only initialize if running in browser and env var exists
const backendUrl = import.meta.env.VITE_BACKEND_URL;
(typeof window === 'undefined' || !backendUrl)

const socket = io(backendUrl, {
    transports: ['websocket'],
    withCredentials: true,
});

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
        if (socket !== null) {
            socket.on('connect', () => {
                console.log('Socket connected in AuthContext');
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected in AuthContext');
            });

            return () => {
                socket.off('connect');
                socket.off('disconnect');
                socket.disconnect();
            };
        } else {
            console.log("No backend URL provided.")
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading, socket }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };

