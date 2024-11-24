// src/apis/api.ts

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export default class Api {
  private static _instance: Api | null = null;

  private _axiosInstance: AxiosInstance;

  private _authorization: string | null;

  public set authorization(value: string) {
    this._authorization = value;
  }

  private constructor(basePath: string, authorization: string | null) {
    this._authorization = authorization || localStorage.getItem("jwtToken") || null;

    this._axiosInstance = axios.create({
      baseURL: basePath,
      // No establezcas 'Content-Type' aquí
    });

    // Interceptor para agregar la autorización a cada solicitud
    this._axiosInstance.interceptors.request.use(
      (config) => {
        if (this._authorization) {
          config.headers.Authorization = `Bearer ${this._authorization}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public static async getInstance() {
    if (!this._instance) {
      const basePath = `http://${import.meta.env.VITE_BASE_URL}:8080`;
      console.log("Base URL:", basePath);
      this._instance = new Api(basePath, null);
    }

    return this._instance;
  }

  public async request<RequestType, ResponseType>(config: AxiosRequestConfig) {
    // No establecer 'Content-Type' aquí; Axios lo manejará automáticamente
    // Especialmente importante para FormData, donde el 'boundary' es necesario

    const configOptions: AxiosRequestConfig = {
      ...config,
      // baseURL ya está establecido en el axiosInstance
    };

    return this._axiosInstance.request<ResponseType>(configOptions);
  }

  public get<RequestType, ResponseType>(config: AxiosRequestConfig) {
    const configOptions: AxiosRequestConfig = {
      ...config,
      method: "GET",
    };

    return this.request<RequestType, ResponseType>(configOptions);
  }

  public post<RequestBodyType, ResponseBodyType>(
    data: RequestBodyType,
    options: AxiosRequestConfig
  ) {
    const configOptions: AxiosRequestConfig = {
      ...options,
      method: "POST",
      data,
    };

    return this.request<RequestBodyType, ResponseBodyType>(configOptions);
  }

  public delete(options: AxiosRequestConfig) {
    const configOptions: AxiosRequestConfig = {
      ...options,
      method: "DELETE",
    };

    return this.request<void, void>(configOptions);
  }

  public put<RequestBodyType, ResponseBodyType>(
    data: RequestBodyType,
    options: AxiosRequestConfig
  ) {
    const configOptions: AxiosRequestConfig = {
      ...options,
      method: "PUT",
      data: data,
    };

    return this.request<RequestBodyType, ResponseBodyType>(configOptions);
  }

  public patch<RequestBodyType, ResponseBodyType>(
    data: RequestBodyType,
    options: AxiosRequestConfig
  ) {
    const configOptions: AxiosRequestConfig = {
      ...options,
      method: "PATCH",
      data: data,
    };

    return this.request<RequestBodyType, ResponseBodyType>(configOptions);
  }
}
