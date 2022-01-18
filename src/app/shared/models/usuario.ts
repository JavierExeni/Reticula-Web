export interface Usuario {
  id?: number;
  correo: number;
  nombre: string;
  username: string;
  spassword: string;
  listaNotificacion?: [];
}

export interface Login {
  username: string;
  spassword: string;
}

export interface AuthResponse {
  res: string;
  data: Usuario;
}
