import React, { useEffect, useState } from "react";
import { usuario } from "../services/user/user"; // Importa el servicio de usuario
import { UsuarioResponseDto } from "../interfaces/usuario/UsuarioResponseDto";
import { UsuarioRequestDto } from "../interfaces/usuario/UsuarioRequestDto";
import { useAuth } from "../context/AuthProvider"; // Importa el contexto de autenticación
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redirigir al usuario

export default function UserSettings() {
    const { getAccessToken } = useAuth(); // Obtiene la función para acceder al token
    const [userInfo, setUserInfo] = useState<UsuarioResponseDto | null>(null);
    const [role, setRole] = useState<string | null>(null); // Rol del usuario obtenido desde el token
    const [editMode, setEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<UsuarioRequestDto | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate(); // Hook para redirigir

    // Obtener el rol del usuario desde el token
    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            try {
                const decodedToken: any = JSON.parse(atob(token.split(".")[1])); // Decodifica el JWT
                setRole(decodedToken.role || "USER"); // Obtiene el rol del usuario
            } catch (error) {
                console.error("Error al decodificar el token:", error);
            }
        }
    }, [getAccessToken]);

    // Cargar la información del usuario al montar el componente
    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const userData = await usuario.getMyInfo();
                setUserInfo(userData);
                setFormData({
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    email: userData.email,
                    phone: userData.phone,
                    address: userData.address,
                    password: "", // La contraseña siempre debe completarse para actualizaciones
                    role: role || "USER", // Usa el rol obtenido del token
                });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setErrorMessage(`Error al obtener la información del usuario: ${error.message}`);
                } else {
                    setErrorMessage("Error desconocido al obtener la información del usuario.");
                }
            }
        }

        fetchUserInfo().catch(console.error);
    }, [role]); // Vuelve a cargar si cambia el rol

    // Manejar cambios en el formulario de edición
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    }

    // Validar los campos del formulario antes de enviar
    function validateForm(data: UsuarioRequestDto | null): string | null {
        if (!data) return "Los datos del formulario no son válidos.";
        if (!data.firstname) return "El nombre es obligatorio.";
        if (!data.lastname) return "El apellido es obligatorio.";
        if (!data.email) return "El correo electrónico es obligatorio.";
        if (!data.phone) return "El teléfono es obligatorio.";
        if (!data.address) return "La dirección es obligatoria.";
        if (!data.password) return "La contraseña es obligatoria.";
        return null;
    }

    // Eliminar al usuario
    async function handleDeleteUser() {
        if (!userInfo) return;
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta?");
        if (!confirmDelete) return;

        try {
            await usuario.eliminarUsuario(userInfo.id);
            alert("Cuenta eliminada con éxito.");
            setUserInfo(null);
            navigate("/"); // Redirige al usuario a la página principal
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(`Error al eliminar la cuenta: ${error.message}`);
            } else {
                setErrorMessage("Error desconocido al eliminar la cuenta.");
            }
        }
    }

    // Actualizar la información del usuario
    async function handleUpdateUser() {
        if (!formData) return;

        // Validación de los campos
        const validationError = validateForm(formData);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            const updatedUser = await usuario.actualizarUsuario(userInfo!.id, formData);
            alert("Información actualizada con éxito.");
            setUserInfo(updatedUser);
            setEditMode(false);
            setErrorMessage(null); // Limpia el mensaje de error
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(`Error al actualizar la información: ${error.message}`);
            } else {
                setErrorMessage("Error desconocido al actualizar la información.");
            }
        }
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center"
            style={{
                backgroundImage: "url('https://source.unsplash.com/random/1920x1080?technology')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="bg-white bg-opacity-90 shadow-md rounded p-8 max-w-lg w-full">
                <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">Configuración del Usuario</h1>

                {errorMessage && (
                    <div className="text-red-500 text-center mb-4">{errorMessage}</div>
                )}

                {userInfo && !editMode ? (
                    <>
                        <p className="text-lg mb-2">
                            <strong>Nombre:</strong> {userInfo.firstname}
                        </p>
                        <p className="text-lg mb-2">
                            <strong>Apellido:</strong> {userInfo.lastname}
                        </p>
                        <p className="text-lg mb-2">
                            <strong>Email:</strong> {userInfo.email}
                        </p>
                        <p className="text-lg mb-2">
                            <strong>Teléfono:</strong> {userInfo.phone}
                        </p>
                        <p className="text-lg mb-2">
                            <strong>Dirección:</strong> {userInfo.address}
                        </p>
                        <p className="text-lg mb-2">
                            <strong>Rol:</strong> {role}
                        </p>
                        <p className="text-lg">
                            <strong>Fecha de Creación:</strong> {new Date(userInfo.createdAt).toLocaleDateString()}
                        </p>

                        <div className="mt-6 flex justify-between">
                            <button
                                className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
                                onClick={handleDeleteUser}
                            >
                                Eliminar Cuenta
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setEditMode(true)}
                            >
                                Editar Información
                            </button>
                        </div>
                    </>
                ) : editMode && formData ? (
                    <>
                        <form>
                            <div className="mb-4">
                                <label className="block font-bold mb-1">Nombre</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-1">Apellido</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-1">Teléfono</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-1">Dirección</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-1">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    placeholder="Ingresa una nueva contraseña"
                                    required
                                />
                            </div>
                        </form>
                        <div className="mt-6 flex justify-between">
                            <button
                                className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setEditMode(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
                                onClick={handleUpdateUser}
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500">Cargando información del usuario...</p>
                )}
            </div>
        </div>
    );
}
