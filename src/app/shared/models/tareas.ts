import { Cliente } from './clientes';
import { Usuario } from './usuario';
export interface Tareas {
  id?: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: number;
  carpeta: null;
  fecha_registro?: Date;
  fecha_limite?: string;
  cliente: {
    id: number;
    nombre?: string;
  };
  usuario: {
    id: number;
  };
}

export interface TareasResponse {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: number;
  carpeta: null;
  fecha_registro?: Date;
  fecha_limite?: string;
  cliente: Cliente;
  usuario: Usuario;
}

export enum TIPO_TAREA {
  ASISTENCIA,
  MANTENIMIENTO,
  TAREA,
}

export enum ESTADOS {
  PENDIENTE,
  ANALISIS,
  FINALIZADO,
  ENTREGADO,
  RETRASADO = -1,
}
