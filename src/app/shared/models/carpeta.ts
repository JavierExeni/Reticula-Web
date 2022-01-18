

export interface Carpeta {
  id?: number;
  nombre: string;
  cliente: {
    id: number;
    nombre?: string
  };
}
