import React, { useEffect, useState } from "react";

interface Item {
    id: number;
    name: string;
    status: string;
}

export default function ApproveItems() {
    const [pendingItems, setPendingItems] = useState<Item[]>([]);

    useEffect(() => {
        // Simula una llamada a la API para obtener ítems pendientes
        const fetchPendingItems = async () => {
            const response = await fetch("/api/items/pending");
            const data = await response.json();
            setPendingItems(data);
        };
        fetchPendingItems();
    }, []);

    const handleApprove = async (itemId: number) => {
        await fetch(`/api/items/${itemId}/approve`, { method: "PUT" });
        setPendingItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    const handleReject = async (itemId: number) => {
        await fetch(`/api/items/${itemId}/reject`, { method: "PUT" });
        setPendingItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-4">Aprobar Pendientes</h1>
            {pendingItems.length === 0 ? (
                <p className="text-gray-600">No hay ítems pendientes</p>
            ) : (
                <ul className="space-y-4">
                    {pendingItems.map((item) => (
                        <li key={item.id} className="flex justify-between items-center bg-gray-200 p-4 rounded-md">
                            <span>{item.name}</span>
                            <div className="space-x-4">
                                <button
                                    onClick={() => handleApprove(item.id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                >
                                    Aprobar
                                </button>
                                <button
                                    onClick={() => handleReject(item.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                    Rechazar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
