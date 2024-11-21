import React, { useEffect, useState } from "react";
import { category as categoryApi} from "../services/category/category";
import { CategoryRequest } from "../interfaces/category/CategoryRequest";
import { useParams, useNavigate } from "react-router-dom";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CategoryRequest>({
    name: "",
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cargar datos de la categoría existente
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await categoryApi.getCategoryById(Number(id));
        setFormData({ name: category.name, description: category.description });
      } catch {
        setErrorMessage("No se pudo cargar la categoría.");
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryApi.updateCategory(Number(id), formData);
      setSuccessMessage("Categoría actualizada con éxito.");
      setTimeout(() => navigate("/dashboard"), 2000); // Redirige después de 2 segundos
    } catch {
      setErrorMessage("Hubo un error al actualizar la categoría.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Editar Categoría</h1>
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
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
