import React, { useEffect, useState } from "react";
import { item } from "../services/item/item"; // Servicio de ítems
import { category } from "../services/category/category"; // Servicio de categorías
import { ItemResponse, Condition } from "../interfaces/item/ItemResponse";
import { CategoryResponse } from "../interfaces/category/CategoryResponse";

export default function AllItems() {
    const [items, setItems] = useState<ItemResponse[]>([]); // Todos los ítems
    const [filteredItems, setFilteredItems] = useState<ItemResponse[]>([]); // Ítems filtrados
    const [categories, setCategories] = useState<CategoryResponse[]>([]); // Categorías
    const [searchTerm, setSearchTerm] = useState<string>(""); // Término de búsqueda por nombre
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // ID de categoría seleccionada
    const [conditionFilter, setConditionFilter] = useState<string>(""); // Filtro por estado
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para errores

    // Obtener todos los ítems y categorías al montar el componente
    useEffect(() => {
        async function fetchData() {
            try {
                const allItems = await item.getAllItems(); // Obtiene todos los ítems
                const allCategories = await category.getAllCategories(); // Obtiene todas las categorías
                setItems(allItems);
                setFilteredItems(allItems); // Inicializa los ítems filtrados
                setCategories(allCategories);
            } catch (error: unknown) {
                setErrorMessage("Error al obtener los datos.");
            }
        }

        fetchData();
    }, []);

    // Manejar cambios en el término de búsqueda
    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        filterItems(term, selectedCategory, conditionFilter);
    }

    // Manejar cambios en la categoría seleccionada
    function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const categoryId = event.target.value === "" ? null : Number(event.target.value);
        setSelectedCategory(categoryId);
        filterItems(searchTerm, categoryId, conditionFilter);
    }

    // Manejar cambios en el filtro de estado
    function handleConditionChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const condition = event.target.value;
        setConditionFilter(condition);
        filterItems(searchTerm, selectedCategory, condition);
    }

    // Función para filtrar los ítems
    function filterItems(term: string, categoryId: number | null, condition: string) {
        let filtered = items;

        if (term) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(term)
            );
        }

        if (categoryId !== null) {
            filtered = filtered.filter((item) => item.categoryName === categories.find(cat => cat.id === categoryId)?.name);
        }

        if (condition) {
            filtered = filtered.filter((item) => item.condition === condition);
        }

        setFilteredItems(filtered);
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-5xl mx-auto mt-10">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Lista de Publicaciones</h2>

            {/* Buscador por nombre */}
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

            {/* Filtro por categoría (desplegable) */}
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

            {/* Filtro por estado */}
            <div className="mb-6">
                <label
                    htmlFor="condition"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Filtrar por estado:
                </label>
                <select
                    id="condition"
                    value={conditionFilter}
                    onChange={handleConditionChange}
                    className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                >
                    <option value="">Todos los estados</option>
                    <option value={Condition.APPROVED}>Nuevo</option>
                    <option value={Condition.REJECTED}>Usado</option>
                </select>
            </div>

            {/* Mostrar errores */}
            {errorMessage && (
                <div className="text-red-500 text-center mb-4">{errorMessage}</div>
            )}

            {/* Lista de ítems */}
            {filteredItems.length > 0 ? (
                <ul className="space-y-4">
                    {filteredItems.map((item) => (
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
                            <p className="text-sm text-gray-500">
                                <strong>Publicado por:</strong> {item.userName}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">
                    {searchTerm || selectedCategory || conditionFilter
                        ? "No se encontraron ítems que coincidan con los filtros aplicados."
                        : "No hay ítems publicados."}
                </p>
            )}
        </div>
    );
}
