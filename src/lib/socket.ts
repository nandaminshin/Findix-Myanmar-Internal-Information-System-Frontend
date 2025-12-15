import { io, Socket } from "socket.io-client"

const backendURL: string = import.meta.env.VITE_BACKEND_URL
export const socket: Socket = io(backendURL, {
    withCredentials: true, // important for cookies
    transports: ["websocket"],
})