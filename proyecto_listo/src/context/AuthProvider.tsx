import { createContext, useState, useEffect, useContext } from "react";
import type { AuthResponse } from "../interfaces/auth/AuthResponse";

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContextType {
    isAuthenticated: boolean;
    getAccessToken: () => string | null;
    saveUser: (userData: AuthResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    getAccessToken: () => null,
    saveUser: () => {},
    logout: () => {}
});

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const role = localStorage.getItem("userRole") || "USER";
        if (token) {
            setAccessToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    function saveUser(userData: AuthResponse) {
        const token = userData.token;
        setAccessToken(token);
        localStorage.setItem("accessToken", token);
        setIsAuthenticated(true);
    }
    
    

    function logout() {
        console.log("Antes de logout:", isAuthenticated);
        setAccessToken(null);
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
    }
    

    function getAccessToken() {
        return accessToken;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);