
import { io } from "socket.io-client";
function getSocketUrl() {
    if (import.meta.env.VITE_SOCKET_URL) {
        return import.meta.env.VITE_SOCKET_URL;
    }

    const apiUrl =
        import.meta.env.VITE_API_URL ||
        "http://localhost:8000/api";

    return apiUrl.replace(/\/api\/?$/, "");
}

export function createChatSocket() {
    return io(getSocketUrl(), {
        withCredentials: true,
        autoConnect: false
    });
}