import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { item } from "../services/item/item";
import { category } from "../services/category/category";
import { ItemResponse } from "../interfaces/item/ItemResponse";
import { CategoryResponse } from "../interfaces/category/CategoryResponse";
import { useAuth } from "../context/AuthProvider";
import {usuario} from "../services/user/user";
import { fetchImage } from "../services/image/image"; // Nueva función
import { Agreement } from "../services/agreement/Agreement";


export default function AllItems() {
    const auth = useAuth();
    const navigate = useNavigate(); // Hook para redirigir
    const [items, setItems] = useState<ItemResponse[]>([]);
    const [filteredItems, setFilteredItems] = useState<ItemResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null); // Inicializa como null para manejar mejor el estado
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<number | null>(null); // ID del usuario autenticado
    const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});


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
        const fetchData = async () => {
            if (!userId) return;

            setLoading(true); // Activa el indicador de carga
            try {
                const allItems = await item.getAllItems();
                const filteredItems = role === "ADMIN"
                    ? allItems.filter((item) => item.status === "PENDING")
                    : allItems.filter((item) => item.status === "APPROVED" && item.user_id !== userId
                );
                const allCategories = await category.getAllCategories();
                setItems(filteredItems);
                setFilteredItems(filteredItems);
                setCategories(allCategories);                  

            } catch (error) {
                console.error("Error al obtener los datos:", error);
                setErrorMessage("Error al obtener los datos.");
            } finally {
                setLoading(false); // Desactiva el indicador de carga
            }
        };

        if (role) {
            fetchData();
        }
    }, [role]);

    useEffect(() => {
        const loadImages = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                console.error("No se encontró un token de autenticación.");
                return;
            }
    
            const imagePromises = items.map(async (item) => {
                try {
                    const imageUrl = await fetchImage(`http://localhost:8080${item.imageUrl}`, accessToken);
                    return { id: item.id, url: imageUrl };
                } catch {
                    return { id: item.id, url: "/default-placeholder.png" };
                }
            });
    
            const images = await Promise.all(imagePromises);
            setImageUrls(images.reduce((acc, img) => ({ ...acc, [img.id]: img.url }), {}));
        };
    
        if (items.length > 0) {
            loadImages();
        }
    }, [items]); // Ejecuta esto solo cuando items cambie

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        filterItems(term, selectedCategory);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = event.target.value === "" ? null : Number(event.target.value);
        setSelectedCategory(categoryId);
        filterItems(searchTerm, categoryId);
    };

    const filterItems = (term: string, categoryId: number | null) => {
        let filtered = items;

        if (term) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(term)
            );
        }

        if (categoryId !== null) {
            filtered = filtered.filter((item) => item.categoryName === categories.find(cat => cat.id === categoryId)?.name);
        }

        setFilteredItems(filtered);
    };

    const handleApprove = async (itemId: number) => {
        try {
            await item.approveItem(itemId, true);
            setFilteredItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
            setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        } catch (error) {
            console.error("Error al aprobar el ítem:", error);
        }
    };

    const handleDeny = async (itemId: number) => {
        try {
            await item.approveItem(itemId, false);
            setFilteredItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
            setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        } catch (error) {
            console.error("Error al denegar el ítem:", error);
        }
    };

    const handleTrade = async (itemId: number) => {
        try {
            // Verificar si el usuario ya tiene un tradeo con este ítem
            const allAgreements = await Agreement.getAllAgreements(); // Asumiendo que tienes un método para obtener todos los acuerdos
            const existingAgreement = allAgreements.find(
                (agreement) =>
                    (agreement.id_itemFin === itemId || agreement.id_itemIni === itemId) &&
                    (agreement.id_Ini === userId || agreement.id_Fin === userId)
            );
    
            if (existingAgreement) {
                // Si ya existe un tradeo, redirige a la página del tradeo existente
                navigate(`/dashboard/agreements/${existingAgreement.id}`);
            } else {
                // Si no existe, redirige al flujo normal de crear un tradeo
                navigate(`/dashboard/agreements/item/${itemId}`);
            }
        } catch (error) {
            console.error("Error al verificar los tradeos existentes:", error);
            alert("Hubo un problema al procesar la solicitud.");
        }
    };
    

    if (loading) {
        return <div>Cargando ítems...</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-5xl mx-auto mt-10">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Lista de Publicaciones</h2>

            <div className="mb-6">
                <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Buscar por nombre:
                </label>
                <input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Escribe aquí para buscar ítems..."
                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                />
            </div>

            <div className="mb-6">
                <label
                    htmlFor="categories"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Filtrar por categoría:
                </label>
                <select
                    id="categories"
                    value={selectedCategory ?? ""}
                    onChange={handleCategoryChange}
                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                >
                    <option value="">Todas las categorías</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {errorMessage && (
                <div className="text-red-500 text-center mb-4">{errorMessage}</div>
            )}

            {filteredItems.length > 0 ? (
                <ul className="space-y-4">
                    {filteredItems.map((item) => (
                        <li
                            key={item.id}
                            className="border border-gray-300 p-4 rounded shadow-sm hover:shadow-md flex flex-col gap-4"
                        >
                            <div>
                                <h3 className="text-lg font-bold text-blue-600">{item.name}</h3>
                                <img
                                    src={imageUrls[item.id] || "/default-placeholder.png"}
                                    alt={item.name}
                                    className="w-full h-auto mt-2"
                                />

                                <p className="text-gray-700">
                                    <strong></strong> {item.description}
                                    </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Categoría:</strong> {item.categoryName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Condición:</strong> {item.condition}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Publicado por:</strong> {item.userName}
                                </p>
                            </div>
                            {role === "ADMIN" && (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleApprove(item.id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => handleDeny(item.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Denegar
                                    </button>
                                </div>
                            )}
                            {role === "USER" && (
                                <button
                                    onClick={() => handleTrade(item.id)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                                >
                                    Tradear
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">
                    {searchTerm || selectedCategory
                        ? "No se encontraron ítems que coincidan con los filtros aplicados."
                        : "No hay ítems publicados."}
                </p>
            )}
        </div>
    );
}
