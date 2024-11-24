import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import UserTradesAccepted from "../components/UserTradesApproved"; // Asegúrate de importar correctamente el componente
import extractRoleFromToken from "../jwt/jwt"; // Importa la función de tu archivo
import AllItems from "../components/AllItems";

export default function Dashboard() {
  const { getAccessToken } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const roleFromToken = extractRoleFromToken(token); // Extrae el rol usando la función
      setRole(roleFromToken || "USER"); // Asigna "USER" como rol predeterminado si no se encuentra
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
            <h2 className="text-lg font-semibold mb-4">Publicaciones Pendientes</h2>
            <AllItems /> {/* Renderiza el componente AllItems */}
          </div>
        ) : (
          // Funcionalidades específicas para usuarios normales
          <div>
            <h2 className="text-lg font-semibold mb-4">Publicaciones Disponibles</h2>
            <AllItems /> {/* Renderiza el componente AllItems */}
          </div>
        )}
      </div>

      {/* Sidebar Derecho: Tradeos recientes */}
      <div className="w-1/4 bg-gray-50 shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-4">Tradeos Recientes</h1>
        <UserTradesAccepted /> {/* Renderiza el componente de tradeos aprobados */}
      </div>
    </div>
  );
}
