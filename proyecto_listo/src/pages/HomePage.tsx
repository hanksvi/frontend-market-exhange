import { useAuth } from '../context/AuthProvider';
import React from 'react';

export default function HomePage() {
    const auth = useAuth();
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Izquierdo: Publicaciones */}
            <div className="flex-1 bg-white shadow-lg p-4">
                <h1 className="text-2xl font-bold mb-4">Publicaciones</h1>
                <div className="grid grid-cols-3 gap-4">
                    {/* Fotos o publicaciones */}
                    <div className="bg-gray-200 h-32 flex items-center justify-center text-gray-600 rounded-lg">
                        Foto 1
                    </div>
                    <div className="bg-gray-200 h-32 flex items-center justify-center text-gray-600 rounded-lg">
                        Foto 2
                    </div>
                    <div className="bg-gray-200 h-32 flex items-center justify-center text-gray-600 rounded-lg">
                        +
                    </div>
                </div>
                {/* Descripción debajo de las publicaciones */}
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Descripción</h2>
                    <p className="text-gray-600">
                        Aquí va la descripción de los objetos en intercambio.
                    </p>
                </div>
            </div>

            {/* Sidebar Derecho: Tradeos recientes */}
            <div>
                {auth.isAuthenticated?(
                    <div className="w-1/4 bg-gray-50 shadow-lg p-4">
                    <h1 className="text-2xl font-bold mb-4">Tradeos recientes</h1>
                    <ul className="space-y-4">
                        <li className="bg-white shadow p-4 rounded-lg">
                            <h3 className="font-semibold">Objeto 1</h3>
                            <p className="text-gray-600 text-sm">Usuario: Juan</p>
                        </li>
                        <li className="bg-white shadow p-4 rounded-lg">
                            <h3 className="font-semibold">Objeto 2</h3>
                            <p className="text-gray-600 text-sm">Usuario: María</p>
                        </li>
                        <li className="bg-white shadow p-4 rounded-lg">
                            <h3 className="font-semibold">Objeto 3</h3>
                            <p className="text-gray-600 text-sm">Usuario: Pedro</p>
                        </li>
                    </ul>
                </div>
                ): (
                   <div>

                   </div> 
                )}
            </div>
            
        </div>
    );
}
