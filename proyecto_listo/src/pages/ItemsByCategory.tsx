import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { category } from "../services/category/category"; // Ruta donde tienes tu servicio
import { ItemResponse } from "../interfaces/item/ItemResponse";

export default function CategoryItemsPage() {
  const { id } = useParams<{ id: string }>(); // Obtiene el ID de la categoría desde la URL
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategoryItems = async () => {
      try {
        const categoryData = await category.getCategoryById(Number(id)); // Obtiene la categoría por ID
        setItems(categoryData.items); // Establece los ítems de la categoría
      } catch (error) {
        console.error("Error al obtener los ítems de la categoría:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [id]);

  if (loading) {
    return <div>Cargando ítems...</div>; // Muestra un mensaje de carga
  }

  if (!items.length) {
    return <div>No hay ítems en esta categoría.</div>; // Muestra un mensaje si no hay ítems
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ítems de la Categoría</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-gray-200 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
