import React, { useState } from "react";
import { category } from "../services/category/category";
import { CategoryRequest } from "../interfaces/category/CategoryRequest";

export default function CreateCategoryPage() {
  const [formData, setFormData] = useState<CategoryRequest>({
    name: "",
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await category.createCategory(formData);
      setSuccessMessage("Categoría creada con éxito.");
      setFormData({ name: "", description: "" });
    } catch {
      setErrorMessage("Hubo un error al crear la categoría.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Crear Categoría</h1>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block font-semibold mb-2">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre de la categoría"
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block font-semibold mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción de la categoría"
            className="w-full border border-gray-300 p-2 rounded"
            rows={4}
            required
          />
        </div>

        {/* Botón de envío */}
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Crear
          </button>
        </div>
      </form>
    </div>
  );
}
