import Api from "apis/api";
import { AuthResponse } from "Interfaces/auth/AuthResponse";
import { LoginRequest } from "Interfaces/auth/LoginRequest";


export async function login(LoginRequest: LoginRequest) {
    const api = await Api.getInstance();
    const response = await api.post<AuthResponse, LoginRequest>("auth/login", LoginRequest);

    api.authorization = response.data.accessToken;

    return response;
}

  