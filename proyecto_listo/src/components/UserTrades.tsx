import React, { useEffect, useState } from "react";
import { usuario } from "../services/user/user"; // Servicio de usuario
import { Agreement } from "../services/agreement/agreement"; // Servicio de acuerdos
import { AgreementResponse } from "../interfaces/agreement/agreementResponse"; // Interfaz de respuesta de acuerdo

export default function UserTrades() {
    const [trades, setTrades] = useState<AgreementResponse[]>([]); // Estado para almacenar los tradeos
    const [filteredTrades, setFilteredTrades] = useState<AgreementResponse[]>([]); // Estado para los tradeos filtrados
    const [userId, setUserId] = useState<number | null>(null); // ID del usuario autenticado
    const [searchTerm, setSearchTerm] = useState<string>(""); // Término de búsqueda
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

    // Obtener los acuerdos del usuario una vez que se tenga el ID
    useEffect(() => {
        async function fetchUserTrades() {
            if (userId === null) return;

            try {
                const userTrades = await Agreement.getAllAgreements(); // Obtiene todos los acuerdos
                const userSpecificTrades = userTrades.filter(
                    (trade) => trade.id_Ini === userId || trade.id_Fin === userId
                ); // Filtra los tradeos donde el usuario es parte
                setTrades(userSpecificTrades);
                setFilteredTrades(userSpecificTrades); // Inicializa los tradeos filtrados
            } catch (error: unknown) {
                setErrorMessage("Error al obtener los tradeos del usuario.");
            }
        }

        fetchUserTrades();
    }, [userId]);

    // Manejar cambios en el término de búsqueda
    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        const term = event.target.value.toLowerCase(); // Convierte el término a minúsculas
        setSearchTerm(term);

        // Filtra los acuerdos según el término de búsqueda
        const filtered = trades.filter(
            (trade) =>
                trade.itemIniName.toLowerCase().includes(term) ||
                trade.itemFinName.toLowerCase().includes(term)
        );
        setFilteredTrades(filtered);
    }
    console.log(trades)

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl mx-auto mt-10">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Mis Tradeos</h2>

            {/* Buscador */}
            <div className="mb-6">
                <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Buscar por ítem:
                </label>
                <input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Escribe aquí para buscar tradeos..."
                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                />
            </div>
            {/* Mostrar errores */}
            {errorMessage && (
                <div className="text-red-500 text-center mb-4">{errorMessage}</div>
            )}

            {/* Lista de tradeos */}
            {filteredTrades.length > 0 ? (
                <ul className="space-y-4">
                    {filteredTrades.map((trade) => (
                        <li
                            key={trade.id}
                            className="border border-gray-300 p-4 rounded shadow-sm hover:shadow-md"
                        >
                            <h3 className="text-lg font-bold text-blue-600">Trade ID: {trade.id}</h3>
                            <p className="text-gray-700">
                                <strong>Ítem Ofrecido:</strong> {trade.itemIniName}
                            </p>
                            <p className="text-gray-700">
                                <strong>Ítem Recibido:</strong> {trade.itemFinName}
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Iniciado por:</strong> {trade.iniUsername}
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Recibido por:</strong> {trade.finUsername}
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Estado:</strong> {trade.state}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">
                    {searchTerm
                        ? "No se encontraron tradeos que coincidan con la búsqueda."
                        : "No tienes tradeos realizados."}
                </p>
            )}
        </div>
    );
}
