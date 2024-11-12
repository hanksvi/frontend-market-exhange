import React from "react";
import DefaultLayout from "../layout/DefaultLayout";
import RegisterForm from "../components/RegisterForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function RegisterPage() {
    const auth= useAuth();
    if(auth.isAuthenticated){
        return <Navigate to="/dashboard"/>
    }
    return (
        <DefaultLayout>
            <RegisterForm />
        </DefaultLayout>
    );
}