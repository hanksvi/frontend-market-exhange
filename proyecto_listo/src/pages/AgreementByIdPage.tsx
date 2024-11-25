import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Agreement } from "../services/agreement/Agreement";
import { AgreementResponse } from "../interfaces/agreement/AgreementResponse";
import { item } from "../services/item/item";
import { ItemResponse } from "../interfaces/item/ItemResponse";

export default function TradeView() {
    const { id } = useParams<{ id: string }>();
    const [trade, setTrade] = useState<AgreementResponse | null>(null);
    const [receptorItem, setReceptorItem] = useState<ItemResponse | null>(null);
    const [iniciadorItem, setIniciadorItem] = useState<ItemResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Cargar el trade y los ítems asociados
    useEffect(() => {
        async function fetchTradeData() {
            try {
                if (!id) return;

                // Obtener los detalles del trade
                const fetchedTrade = await Agreement.getAgreementById(Number(id));
                setTrade(fetchedTrade);

                // Obtener los ítems del receptor e iniciador
                if (fetchedTrade.itemFinId) {
                    const receptorFetchedItem = await item.getItemById(fetchedTrade.itemFinId);
                    setReceptorItem(receptorFetchedItem);
                }

                if (fetchedTrade.itemIniId) {
                    const iniciadorFetchedItem = await item.getItemById(fetchedTrade.itemIniId);
                    setIniciadorItem(iniciadorFetchedItem);
                }
            } catch (error) {
                console.error("Error al obtener los datos del tradeo:", error);
                setErrorMessage("Error al obtener los datos del tradeo.");
            }
        }
        fetchTradeData();
    }, [id]);

    if (errorMessage) {
        return <div className="text-red-500 text-center">{errorMessage}</div>;
    }

    if (!trade) {
        return <div>Cargando información del tradeo...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-blue-700 mb-4">
                    Tradeo {trade.id} - Estado: {trade.state}
                </h1>
                <div className="grid grid-cols-2 gap-4">
                    {/* Ítem del receptor */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Receptor</h2>
                        {receptorItem ? (
                            <div className="border p-4 rounded shadow-md bg-gray-100">
                                <h3 className="text-lg font-bold text-blue-600">{receptorItem.name}</h3>
                                <p>{receptorItem.description}</p>
                                <p className="text-sm text-gray-500">
                                    <strong>Categoría:</strong> {receptorItem.categoryName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Estado:</strong> {receptorItem.condition}
                                </p>
                            </div>
                        ) : (
                            <p>Cargando ítem del receptor...</p>
                        )}
                    </div>
                    {/* Ítem del iniciador */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Iniciador</h2>
                        {iniciadorItem ? (
                            <div className="border p-4 rounded shadow-md bg-gray-100">
                                <h3 className="text-lg font-bold text-blue-600">{iniciadorItem.name}</h3>
                                <p>{iniciadorItem.description}</p>
                                <p className="text-sm text-gray-500">
                                    <strong>Categoría:</strong> {iniciadorItem.categoryName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Estado:</strong> {iniciadorItem.condition}
                                </p>
                            </div>
                        ) : (
                            <p>Cargando ítem del iniciador...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
