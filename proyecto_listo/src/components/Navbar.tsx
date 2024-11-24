import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { usuario } from "../services/user/user"; // Servicio de usuario

export default function Navbar() {
    
    const auth = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userName, setUserName] = useState<string | null>(null); 

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
    const closeDropdown = () => setIsDropdownOpen(false);

    const { getAccessToken } = useAuth();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = getAccessToken();

            if (token) {
                try {
                    // Decodifica el token para obtener el rol
                    const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
                    setRole(decodedToken.role || "USER");

                    // Llama al servicio para obtener el nombre del usuario
                    const userInfo = await usuario.getMyInfo();
                    setUserName(`${userInfo.firstname}`); // Establece el nombre completo
                } catch (error) {
                    console.error("Error al obtener información del usuario:", error);
                }
            }
        };

        if (auth.isAuthenticated) {
            fetchUserInfo();
        }
    }, [auth.isAuthenticated, getAccessToken]);


    
    //psuhwa ps
    
    return (
        <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
            {/* Sección izquierda del navbar */}
            <div className="flex space-x-4">
                {auth.isAuthenticated && (

                    <>
                    {role === "USER" && (
                        <>
                        <Link to= "/dashboard" className="hover:text-gray-300">
                        Home
                        </Link>
                        
                        <Link to="/dashboard/item/create" className="hover:text-gray-300">
                        Publicar

                    </Link>
                    <Link to="/dashboard/category" className="hover:text-gray-300">

                        Categorías
                    </Link>
                    <Link to="/dashboard/category/create" className="hover:text-gray-300">
                        Ayuda
                    </Link>
                    </>
                    )}
                    {role === "ADMIN" && (
                        <>
                        <Link to= "/dashboard" className="hover:text-gray-300">
                        Home
                        </Link>
                        
                        <Link to="/dashboard/category/create" className="hover:text-gray-300">
                        Crear Categoria

                    </Link>
                    <Link to="/dashboard/category" className="hover:text-gray-300">

                        Categorías
                    </Link>
                    </>
                    )}
                        
                    </>
                )}
            </div>

            {/* Sección derecha del navbar */}
            <div className="relative">
                {auth.isAuthenticated ? (
                    
                    <div>
                        {/* Botón del dropdown */}
                        <button
                            className="flex items-center bg-gray-700 p-2 rounded-full hover:bg-gray-600"
                            onClick={toggleDropdown}
                            aria-expanded={isDropdownOpen}
                            aria-label="Perfil"
                        >
                            <FaRegUserCircle className="mr-2" />
                            <p>{userName ? userName : "Perfil"}</p>
                            {/* Icono de flecha */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {/* Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg">
                                <Link
                                    to="/dashboard/cuenta"
                                    onClick={closeDropdown}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Cuenta
                                </Link>
                                <button
                                    onClick={() => {
                                        closeDropdown();
                                        auth.logout();
                                    }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex space-x-4">
                        <Link to="/login" className="hover:text-gray-300 text-sm font-semibold">
                            Login
                        </Link>
                        <Link to="/register" className="hover:text-gray-300 text-sm font-semibold">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}