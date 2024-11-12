import { useContext, createContext, useState, useEffect } from "react";

interface AuthProviderProps{
    children: React.ReactNode;
}

//Vamos a crear nuestro contexto
const  AuthContext = createContext({
    isAuthenticated: false,
})

//Valida si hay autenticacion o no y v dejar pasar a las rutas que estan protegidas, manejar el tema de la autenticacion 
export function AuthProvider({children}: AuthProviderProps){
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return <AuthContext.Provider value={{isAuthenticated}}>{children}</AuthContext.Provider>
}

//Ahora creamos un hook 

export const useAuth = () => useContext(AuthContext);
