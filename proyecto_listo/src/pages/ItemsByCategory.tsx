import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ItemResponse } from "../interfaces/item/ItemResponse";
import { item } from "../services/item/item"; // Usa el servicio de ítems

export default function CategoryItemsPage() {
  const { id } = useParams<{ id: string }>(); // Obtiene el ID de la categoría
  const [items, setItems] = useState<ItemResponse[]>([]); // Estado para los ítems
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsData = await item.getItemsByCategory(Number(id)); // Obtiene los ítems por categoría
        setItems(itemsData);
      } catch (error) {
        console.error("Error al obtener ítems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [id]);

  if (loading) return <div>Cargando ítems...</div>; // Mensaje de carga
  if (!items.length) return <div>No hay ítems en esta categoría.</div>; // Mensaje si no hay ítems

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300"
        >
          <h2 className="text-xl font-bold text-blue-600 mb-2">{item.name}</h2>
          <p className="text-gray-700 mb-1">{item.description}</p>
          <p className="text-sm text-gray-500">
            <strong>Categoría:</strong> {item.categoryName}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Estado:</strong> {item.condition}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Publicado por:</strong> {item.userName}
          </p>
          {item.imageUrl && (
            <img
              src={`http://localhost:8080/item/image/${item.imageUrl}`}
              alt={item.name}
              className="w-full h-auto mt-2 rounded-md"
            />
          )}
        </div>
      ))}
    </div>
  );
}
