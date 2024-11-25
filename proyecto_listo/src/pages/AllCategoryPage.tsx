import React, { useEffect, useState } from "react";
import { category } from "../services/category/category"; // Ruta donde tienes tu servicio
import { CategoryResponse } from "../interfaces/category/CategoryResponse";
import { Link, useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { useAuth } from "../context/AuthProvider";
import { usuario } from "../services/user/user";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null); // Inicializa como null para manejar mejor el estado
  const [userId, setUserId] = useState<number | null>(null); // ID del usuario autenticado

  useEffect(() => {
    const fetchUserRole = async () => {
        const token = auth.getAccessToken();
        const userInfo = await usuario.getMyInfo(); // Obtiene la información del usuario autenticado
        setUserId(userInfo.id); // Establece el userId

        if (token) {
            try {
                const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
                setRole(decodedToken.role || "USER");
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                setRole("USER"); // Fallback en caso de error
            }
        } else {
            setRole("USER");
        }
    };

    fetchUserRole();
}, [auth]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await category.getAllCategories();
        console.log("Categorías recibidas:", allCategories); // Verificar si llegan correctamente
        setCategories(allCategories);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Cargando categorías...</div>; // Muestra un mensaje de carga
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-transparent">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="bg-purple-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg"
        >
          {/* Tarjeta de categoría */}
          <h3 className="text-lg font-bold">{cat.name}</h3>
          <p className="text-sm mt-2">{cat.description}</p>
          {/* Botón de editar visible solo para admin */}
          {role === "ADMIN" && (
            <button
              onClick={() => navigate(`/dashboard/category/edit/${cat.id}`)}
              className="mt-4 bg-white text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-700 hover:text-white transition"
            >
              Editar
            </button>
          )}
        </div>
      ))}

      {/* Tarjeta para crear nueva categoría */}
      {role === "ADMIN" && (
        <div
          onClick={() => navigate("/dashboard/category/create")}
          className="flex justify-center items-center bg-purple-300 hover:bg-purple-400 text-white text-4xl font-bold rounded-lg shadow-md cursor-pointer"
        >
          +
        </div>
      )}
    </div>
  );
}
