import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterRequest } from "../interfaces/auth/RegisterRequest";
import RegisterForm from "../components/RegisterForm";
import { register } from "../services/auth/register";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterRequest>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        isAdmin: false,
    });

    async function handleRegisterSubmit(data: RegisterRequest) {
        try {
            await register(data);
            navigate("/login");
        } catch {
            alert("Error al registrar. Inténtalo de nuevo.");
        }
    }

    return (

        <RegisterForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleRegisterSubmit}
        />
    );
}
