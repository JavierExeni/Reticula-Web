export interface Usuario {
  codigo_id?: number;
  scorreo: number;
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
