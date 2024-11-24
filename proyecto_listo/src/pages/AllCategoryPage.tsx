import React, { useEffect, useState } from "react";
import { category } from "../services/category/category"; // Ruta donde tienes tu servicio
import { CategoryResponse } from "../interfaces/category/CategoryResponse";
import CategoryCard from "./CategoryCard";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await category.getAllCategories(); // Llama al método del servicio
        setCategories(allCategories); // Almacena las categorías en el estado
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
        <CategoryCard
          key={cat.id}
          id={cat.id}
          name={cat.name}
          description={cat.description}
        />
      ))}
    </div>
  );
}
