import Api from '../../apis/api';
import { UsuarioRequestDto } from '../../interfaces/usuario/UsuarioRequestDto';
import { UsuarioResponseDto } from '../../interfaces/usuario/UsuarioResponseDto';

export const usuarioService = {
    /**
     * Obtiene un usuario por su ID.
     * @param id ID del usuario a buscar.
     * @returns UsuarioResponseDto
     */
    async getUsuarioById(id: number): Promise<UsuarioResponseDto> {
        const api = await Api.getInstance();
        const response = await api.get<void, UsuarioResponseDto>({ url: `/usuarios/${id}` });
        return response.data;
    },

    /**
     * Lista todos los usuarios.
     * @returns Array de UsuarioResponseDto
     */
    async listarUsuarios(): Promise<UsuarioResponseDto[]> {
        const api = await Api.getInstance();
        const response = await api.get<void, UsuarioResponseDto[]>({ url: '/usuarios/listar' });
        return response.data;
    },

    /**
     * Actualiza un usuario existente.
     * @param id ID del usuario a actualizar.
     * @param data Datos para actualizar el usuario.
     * @returns UsuarioResponseDto
     */
    async actualizarUsuario(id: number, data: UsuarioRequestDto): Promise<UsuarioResponseDto> {
        const api = await Api.getInstance();
        const response = await api.put<UsuarioRequestDto, UsuarioResponseDto>(data, {
            url: `/usuarios/${id}`,
        });
        return response.data;
    },

    /**
     * Elimina un usuario por su ID.
     * @param id ID del usuario a eliminar.
     */
    async eliminarUsuario(id: number): Promise<void> {
        const api = await Api.getInstance();
        await api.delete({ url: `/usuarios/${id}` });
    },

    /**
     * Obtiene información del usuario autenticado (propio).
     * @returns UsuarioResponseDto
     */
    async getMyInfo(): Promise<UsuarioResponseDto> {
        const api = await Api.getInstance();
        const response = await api.get<void, UsuarioResponseDto>({ url: '/usuarios/me' });
        return response.data;
    },
};
