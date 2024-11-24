export interface UsuarioRequestDto {

  firstname: string; // El nombre del usuario, obligatorio, máximo 50 caracteres
  lastname: string; // El apellido del usuario, obligatorio, máximo 50 caracteres
  email: string; // El correo electrónico del usuario, obligatorio y válido
  phone: string; // El teléfono del usuario, obligatorio, entre 7 y 15 caracteres
  password: string; // La contraseña del usuario, obligatoria, mínimo 8 caracteres
  address: string; // La dirección del usuario, obligatoria, máximo 100 caracteres
  role: string; // El rol del usuario, obligatorio
}

