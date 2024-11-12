// src/pages/AdminDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Retrocede a la página anterior
    };

    return (
        <div>
            <h1>Bienvenido al Dashboard de Administrador</h1>
            <button 
                onClick={handleBack} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
                Retroceder
            </button>
        </div>
    );
}
