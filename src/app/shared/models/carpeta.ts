

export interface Carpeta {
  codigo_id?: number;
  nombre: string;
  cliente: {
    lpersona_id: number;
    nombre?: string
  };
}
