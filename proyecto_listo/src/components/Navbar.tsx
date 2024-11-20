import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { FaRegUserCircle } from "react-icons/fa";

export default function Navbar() {
    const auth = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
            {/* Sección izquierda del navbar */}
            <div className="flex space-x-4">
                <a href="/publicacion" className="hover:text-gray-300">
                    Publicar
                </a>
                <a href="/category" className="hover:text-gray-300">
                    Categorias
                </a>
                <a href="/help" className="hover:text-gray-300">
                    Ayuda
                </a>
            </div>

            {/* Sección derecha del navbar */}
            <div className="relative">
                {auth.isAuthenticated ? (
                    // Menú desplegable para usuarios autenticados
                    <div>
                        <button
                            className="flex items-center bg-gray-700 p-2 rounded-full hover:bg-gray-600"
                            onClick={toggleDropdown}
                        >
                            <FaRegUserCircle />
                            <p>Perfil</p>
                            {/* Icono de flecha */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
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
                                <a
                                    href="/account"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Cuenta
                                </a>
                                <button
                                    onClick={auth.logout}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Opciones para usuarios no autenticados
                    <div className="flex space-x-4">
                        <a
                            href="/login"
                            className="hover:text-gray-300 text-sm font-semibold"
                        >
                            Login
                        </a>
                        <a
                            href="/register"
                            className="hover:text-gray-300 text-sm font-semibold"
                        >
                            Register
                        </a>
                    </div>
                )}
            </div>
        </nav>
    );
}
