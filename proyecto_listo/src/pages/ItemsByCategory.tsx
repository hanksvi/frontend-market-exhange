import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ItemResponse } from "../interfaces/item/ItemResponse";
import { item } from "../services/item/item"; // Usa el servicio de ítems

export default function CategoryItemsPage() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
      const fetchItems = async () => {
          try {
              const itemsData = await item.getItemsByCategory(Number(id));
              setItems(itemsData);
          } catch (error) {
              console.error("Error al obtener ítems:", error);
          } finally {
              setLoading(false);
          }
      };

      fetchItems();
  }, [id]);

  if (loading) return <div>Cargando ítems...</div>;

  if (!items.length) return <div>No hay ítems en esta categoría.</div>;

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {items.map((item) => (
              <div key={item.id} className="bg-gray-200 p-4 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <img
                    src={`http://localhost:8080${item.imageUrl}`}
                    alt={item.name}
                    onError={(e) => { e.currentTarget.src = "/default-placeholder.png"; }}
                    className="w-full h-auto mt-2"
                  />
              </div>
          ))}
      </div>
  );
}