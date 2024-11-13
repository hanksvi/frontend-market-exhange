import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import api from "../apis/api";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, Navigate } from "react-router-dom";
// Importa las imágenes desde src/assets/img/ si están allí
import idle1 from "../assets/img/idle/1.png";
import idle2 from "../assets/img/idle/2.png";
import idle3 from "../assets/img/idle/3.png";
import idle4 from "../assets/img/idle/4.png";
import idle5 from "../assets/img/idle/5.png";
import read1 from "../assets/img/read/1.png";
import read2 from "../assets/img/read/2.png";
import read3 from "../assets/img/read/3.png";
import read4 from "../assets/img/read/4.png";
import cover1 from "../assets/img/cover/1.png";
import cover2 from "../assets/img/cover/2.png";
import cover3 from "../assets/img/cover/3.png";
import cover4 from "../assets/img/cover/4.png";
import cover5 from "../assets/img/cover/5.png";
import cover6 from "../assets/img/cover/6.png";
import cover7 from "../assets/img/cover/7.png";
import cover8 from "../assets/img/cover/8.png";
import { LoginRequest } from "../interfaces/auth/LoginRequest";
import { login } from "../services/auth/login.ts";


const idleImages: string[] = [idle1, idle2, idle3, idle4, idle5];
const readImages: string[] = [read1, read2, read3, read4];
const coverImages: string[] = [cover1, cover2, cover3, cover4, cover5, cover6, cover7, cover8];

export default function LoginForm() {
    const [formData, setFormData] = useState<LoginRequest>({ username: "", password: "" });
    const [monsterSrc, setMonsterSrc] = useState<string>(idleImages[0]);
    const [error, setError] = useState<string | null>(null);
    const seguirPunteroMouse = useRef<boolean>(true);
    const coverInterval = useRef<number | null>(null);
    const descubrirInterval = useRef<number | null>(null);

    const auth = useAuth();
    const navigate = useNavigate();

    if (auth.isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    // Estado para manejar el tamaño de la ventana
    const [windowSize, setWindowSize] = useState<{ anchoMitad: number; altoMitad: number }>({
        anchoMitad: window.innerWidth / 2,
        altoMitad: window.innerHeight / 2,
    });

    // Manejar redimensionamiento de ventana
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                anchoMitad: window.innerWidth / 2,
                altoMitad: window.innerHeight / 2,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Manejar movimiento del mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (seguirPunteroMouse.current) {
                const { anchoMitad, altoMitad } = windowSize;
                if (e.clientX < anchoMitad && e.clientY < altoMitad) {
                    setMonsterSrc(idleImages[1]);
                } else if (e.clientX < anchoMitad && e.clientY > altoMitad) {
                    setMonsterSrc(idleImages[2]);
                } else if (e.clientX > anchoMitad && e.clientY < altoMitad) {
                    setMonsterSrc(idleImages[4]);
                } else {
                    setMonsterSrc(idleImages[3]);
                }
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (coverInterval.current !== null) {
                window.clearInterval(coverInterval.current);
                coverInterval.current = null;
            }
            if (descubrirInterval.current !== null) {
                window.clearInterval(descubrirInterval.current);
                descubrirInterval.current = null;
            }
        };
    }, [windowSize]);

    // Manejar foco en el input de usuario
    const handleUsuarioFocus = () => {
        seguirPunteroMouse.current = false;
    };

    const handleUsuarioBlur = () => {
        seguirPunteroMouse.current = true;
    };

    // Manejar foco en el input de contraseña
    const handleClaveFocus = () => {
        seguirPunteroMouse.current = false;
        let cont = 1;

        if (coverInterval.current !== null) {
            window.clearInterval(coverInterval.current);
            coverInterval.current = null;
        }

        coverInterval.current = window.setInterval(() => {
            if (cont <= coverImages.length) {
                setMonsterSrc(coverImages[cont - 1]);
                cont++;
            } else {
                if (coverInterval.current !== null) {
                    window.clearInterval(coverInterval.current);
                    coverInterval.current = null;
                }
            }
        }, 60);
    };

    const handleClaveBlur = () => {
        seguirPunteroMouse.current = true;
        let cont = coverImages.length;

        if (descubrirInterval.current !== null) {
            window.clearInterval(descubrirInterval.current);
            descubrirInterval.current = null;
        }

        descubrirInterval.current = window.setInterval(() => {
            if (cont > 0) {
                setMonsterSrc(coverImages[cont - 1]);
                cont--;
            } else {
                if (descubrirInterval.current !== null) {
                    window.clearInterval(descubrirInterval.current);
                    descubrirInterval.current = null;
                }
            }
        }, 60);
    };

    // Manejar cambio en los inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await login(formData); // Llama a la función `login` y recibe `AuthResponse`
            setError(null);
    
            // Guarda el usuario en el contexto de autenticación si tiene los tokens
            if (data.data.accessToken ) {
                auth.saveUser(data);
                navigate("/dashboard"); 
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Credenciales incorrectas. Intenta nuevamente.";
            setError(message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center relative">
            <img src={monsterSrc} alt="Monster" className="w-64 h-64 mb-8" />
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded px-8 py-6 border-4 border-purple-700">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                        Usuario
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        onFocus={handleUsuarioFocus}
                        onBlur={handleUsuarioBlur}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="mounstrito.gracioso@gmail.com"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={handleClaveFocus}
                        onBlur={handleClaveBlur}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="***"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}
