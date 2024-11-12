// src/layout/DefaultLayout.tsx
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface DefaultLayoutProps {
    children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white">
                <nav className="container mx-auto p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Mi Aplicación</h1>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/" className="hover:underline">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" className="hover:underline">
                                Registro
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
                {children}
            </main>

            <footer className="bg-gray-800 text-white p-4 text-center">
                © 2024 Mi Aplicación. Todos los derechos reservados.
            </footer>
        </div>
    );
}