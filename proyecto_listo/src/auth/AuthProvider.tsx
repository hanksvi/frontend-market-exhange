import { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse } from "../types/types";

interface AuthProviderProps{
    children: React.ReactNode;
}

//Vamos a crear nuestro contexto
const  AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => {},
    saveUser: (userData: AuthResponse) => {},
    getRefreshToken: () => {},
});

//Valida si hay autenticacion o no y v dejar pasar a las rutas que estan protegidas, manejar el tema de la autenticacion 
export function AuthProvider({children}: AuthProviderProps){
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken ]= useState<string>("");
    const [refreshToken, setRefreshToken]= useState<string>("");


    function getAccessToken(){
        return accessToken;
    }

    function getRefreshToken(){
        const token= localStorage.getItem("token");
        if(token){
            const {refreshToken }=  JSON.parse(token);
            return refreshToken;
        }
    }

    function saveUser(userData: AuthResponse){
        setAccessToken(userData.body.accessToken);
        //setRefreshToken(userData.body.refreshToken);

        localStorage.setItem("token", JSON.stringify(userData.body.refreshToken));
        setIsAuthenticated(true);
    }


    return <AuthContext.Provider value={{isAuthenticated, getAccessToken, saveUser, getRefreshToken}}>{children}</AuthContext.Provider>
}

//Ahora creamos un hook 

export const useAuth = () => useContext(AuthContext);