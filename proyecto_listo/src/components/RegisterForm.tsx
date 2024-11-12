import React, { useState } from "react";
import api from "../apis/api"; // Importa la instancia de axios configurada
import axios from "axios";
import { AuthResponseError } from "../types/types";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import {useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    const auth = useAuth();
    const goTo= useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await api.post("/auth/register", {
                firstName,
                lastName,
                email,
                password,
                phone,
                address,
                isAdmin,
            });

            if (response.status === 201) {
                setSuccess("Usuario creado exitosamente");
                setError(null);

                goTo("/");
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                const authError = err.response?.data as AuthResponseError;
                setError(authError.body.error || "Ya existe una cuenta con este correo electrónico.");
            } else {
                setError("Error en el registro: " + (err as Error).message);
            }
            setSuccess(null);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white shadow-md rounded px-8 py-6 border-4 border-blue-700"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>

                <div className="mb-4 h-6 flex items-center">
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>

                {success && <p className="text-green-600 mb-4">{success}</p>}

                {/* Input para Nombre */}
                <div className="mb-4 relative flex items-center">
                    <FaUser className="absolute left-3 text-gray-500" size={20} />
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="shadow appearance-none border border-gray-300 rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight transition-all duration-300 focus:outline-none focus:border-blue-600 focus:shadow-lg"
                        placeholder="Tu nombre"
                        required
                    />
                </div>

                {/* Repite el mismo bloque para otros campos */}
                <div className="mb-4 relative flex items-center">
                    <FaUser className="absolute left-3 text-gray-500" size={20} />
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="shadow appearance-none border border-gray-300 rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight transition-all duration-300 focus:outline-none focus:border-blue-600 focus:shadow-lg"
                        placeholder="Tu apellido"
                        required
                    />
                </div>

                <div className="mb-4 relative flex items-center">
                    <FaEnvelope className="absolute left-3 text-gray-500" size={20} />
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border border-gray-300 rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight transition-all duration-300 focus:outline-none focus:border-blue-600 focus:shadow-lg"
                        placeholder="tuemail@ejemplo.com"
                        required
                    />
                </div>

                <div className="mb-4 relative flex items-center">
                    <FaPhone className="absolute left-3 text-gray-500" size={20} />
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="shadow appearance-none border border-gray-300 rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight transition-all duration-300 focus:outline-none focus:border-blue-600 focus:shadow-lg"
                        placeholder="Tu número de teléfono"
                        required
                    />
                </div>

                <div className="mb-4 relative flex items-center">
                    <FaMapMarkerAlt className="absolute left-3 text-gray-500" size={20} />
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="shadow appearance-none border border-gray-300 rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight transition-all duration-300 focus:outline-none focus:border-blue-600 focus:shadow-lg"
                        placeholder="Tu dirección"
                        required
                    />
                </div>

                <div className="mb-4 relative flex items-center">
                    <FaLock className="absolute left-3 text-gray-500" size={20} />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (e.target.value.length < 8) {
                                setError("La contraseña debe tener al menos 8 caracteres");
                            } else {
                                setError(null);
                            }
                        }}
                        className="shadow appearance-none border border-gray-300 rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight transition-all duration-300 focus:outline-none focus:border-blue-600 focus:shadow-lg"
                        placeholder="Contraseña"
                        required
                    />
                </div>

                <div className="mb-6 relative flex items-center">
                    <FaLock className="absolute left-3 text-gray-500" size={20} />
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (e.target.value !== password) {
                                setError("Las contraseñas no coinciden");
                            } else {
                                setError(null);
                            }
                        }}
                        className="shadow appearance-none border border-gray-300 rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight transition-all duration-300 focus:outline-none focus:border-blue-600 focus:shadow-lg"
                        placeholder="Confirmar contraseña"
                        required
                    />
                </div>

                <div className="mb-6 flex items-center">
                    <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                        className="mr-2 leading-tight transform transition-transform duration-300 hover:scale-110"
                    />
                    <span className="text-gray-700 text-sm">Registrar como administrador</span>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-transform duration-300 hover:scale-105"
                    >
                        Registrarse
                    </button>
                </div>

                <p className="mt-4 text-center text-gray-600 text-sm">
                    ¿Ya tienes una cuenta? <a href="/login" className="text-blue-600 hover:underline">Inicia Sesión</a>
                </p>
            </form>
        </div>
    );
}