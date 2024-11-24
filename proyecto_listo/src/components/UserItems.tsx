import React, { useEffect, useState } from "react";
import { item } from "../services/item/item"; // Servicio de ítems
import { usuario } from "../services/user/user"; // Servicio de usuario
import { ItemResponse } from "../interfaces/item/ItemResponse";

export default function UserItems() {
    const [items, setItems] = useState<ItemResponse[]>([]); // Estado para almacenar los ítems del usuario
    const [userId, setUserId] = useState<number | null>(null); // ID del usuario autenticado
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para errores

    // Obtener el ID del usuario autenticado al montar el componente
    useEffect(() => {
        async function fetchUserId() {
            try {
                const userInfo = await usuario.getMyInfo(); // Obtiene la información del usuario autenticado
                setUserId(userInfo.id);
            } catch (error: unknown) {
                setErrorMessage("Error al obtener la información del usuario.");
            }
        }

        fetchUserId();
    }, []);

    // Obtener los ítems del usuario una vez que se tenga el ID
    useEffect(() => {
        async function fetchUserItems() {
            if (userId === null) return;

            try {
                const userItems = await item.getItemsByUser(userId); // Obtiene los ítems por ID del usuario
                setItems(userItems);
            } catch (error: unknown) {
                setErrorMessage("Error al obtener los ítems del usuario.");
            }
        }

        fetchUserItems();
    }, [userId]);

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Mis Ítems Publicados</h2>

            {errorMessage && (
                <div className="text-red-500 text-center mb-4">{errorMessage}</div>
            )}

            {items.length > 0 ? (
                <ul className="space-y-4">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="border border-gray-300 p-4 rounded shadow-sm hover:shadow-md"
                        >
                            <h3 className="text-lg font-bold text-blue-600">{item.name}</h3>
                            <p className="text-gray-700">{item.description}</p>
                            <p className="text-sm text-gray-500">
                                <strong>Categoría:</strong> {item.categoryName}
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Estado:</strong> {item.condition}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No tienes ítems publicados.</p>
            )}
        </div>
    );
}
