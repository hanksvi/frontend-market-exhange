import Api from "../../apis/api.ts";
import { AuthResponse } from "@interfaces/auth/AuthResponse.ts";
import { LoginRequest } from "@interfaces/auth/LoginRequest.ts";


export async function login(LoginRequest: LoginRequest) {
    const api = await Api.getInstance();
    const response = await api.post<LoginRequest, AuthResponse>(LoginRequest, {
        url: "/auth/login",
    });

    const token = response.data.token;
    localStorage.setItem("jwtToken", token);

    api.authorization = response.data.token;

    return response;
}

  