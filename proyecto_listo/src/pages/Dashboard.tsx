import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";

export default function Dashboard() {
    const { getAccessToken } = useAuth();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            const decodedToken: any = JSON.parse(atob(token.split(".")[1])); // Decodifica el JWT (sin dependencia externa)
            setRole(decodedToken.role || "USER"); // Extrae el rol
        }
    }, [getAccessToken]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Izquierdo */}
            <div className="flex-1 bg-white shadow-lg p-4">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

                {role === "ADMIN" ? (
                    // Funcionalidades específicas para administradores
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Acciones de Administrador</h2>
                        <ul className="space-y-4">
                            <li className="bg-gray-200 p-4 rounded-lg">
                                <h3 className="font-bold">Aprobar Pedidos</h3>
                                <p className="text-gray-600">Gestiona los pedidos pendientes de aprobación.</p>
                                <a href="/admin/pedidos" className="text-blue-500 hover:underline">Ir a Pedidos</a>
                            </li>
                            <li className="bg-gray-200 p-4 rounded-lg">
                                <h3 className="font-bold">Gestionar Categorías</h3>
                                <p className="text-gray-600">Crea, edita o elimina categorías de productos.</p>
                                <a href="/dashboard/category/create" className="text-blue-500 hover:underline">Ir a Categorías</a>
                            </li>
                        </ul>
                    </div>
                ) : (
                    // Funcionalidades específicas para usuarios normales
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Mis Publicaciones</h2>
                        <ul className="space-y-4">
                            <li className="bg-gray-200 p-4 rounded-lg">Publicación 1</li>
                            <li className="bg-gray-200 p-4 rounded-lg">Publicación 2</li>
                            <li className="bg-gray-200 p-4 rounded-lg">Publicación 3</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Sidebar Derecho: Tradeos recientes */}
            <div className="w-1/4 bg-gray-50 shadow-lg p-4">
                <h1 className="text-2xl font-bold mb-4">Tradeos Recientes</h1>
                <ul className="space-y-4">
                    <li className="bg-white shadow p-4 rounded-lg">
                        <h3 className="font-semibold">Objeto 1</h3>
                        <p className="text-gray-600 text-sm">Usuario: Juan</p>
                    </li>
                    <li className="bg-white shadow p-4 rounded-lg">
                        <h3 className="font-semibold">Objeto 2</h3>
                        <p className="text-gray-600 text-sm">Usuario: María</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}


