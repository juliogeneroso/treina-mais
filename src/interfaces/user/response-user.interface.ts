export interface Usuario {
  id: number;
  name: string; //nome?
  email: string;
  avatarCodigo: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  usuario: Usuario;
}