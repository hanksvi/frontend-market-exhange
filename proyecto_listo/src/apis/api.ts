import axios from 'axios';

// Configuración de la instancia de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // usa la URL de la API definida en .env
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para iniciar sesión
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error("Error en el inicio de sesión");
  }
};

// Función para registrarse
export const register = async (firstName: string, lastName: string, email: string, password: string, phone: string, address: string, isAdmin: boolean) => {
  try {
    const response = await api.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      isAdmin,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      throw new Error("Ya existe una cuenta con este correo electrónico.");
    }
    throw new Error("Error en el registro");
  }
};

// Exporta la instancia de Axios para otros usos si es necesario
export default api;
