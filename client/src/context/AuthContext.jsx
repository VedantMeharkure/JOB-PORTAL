import {
    createContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


    const getCurrentUser = async () => {

        try {

            const response =
                await api.get("/auth/me");

            setUser(response.data.user);

        } catch (error) {

            setUser(null);

        } finally {

            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await api.post(
            "/auth/login",
            {
                email,
                password
            }
        );

        setUser(response.data.user);

        return response.data;
    };
    const logout = async () => {

        try {

            await api.post("/auth/logout");

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        } finally {

            setUser(null);
        }
    };


    useEffect(() => {

        getCurrentUser();

    }, []);


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                getCurrentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};