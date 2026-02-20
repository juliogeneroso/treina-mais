import type { Usuario } from "../user/response-user.interface";

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  usuario: Usuario | null;
}