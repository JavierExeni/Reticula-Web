import { Usuario } from './usuario';
import { Cliente } from './clientes';

export interface TrabajoTaller {
  id?: number;
  cliente: {
    id: number;
    nombre?: string;
  };
  referencia: string;
  equipo: string;
  problema: string;
  solucion?: string;
  estado: number;
  bdeleted?: boolean;
  usuario: {
    id: number;
  };
  fecha?: Date;
  dtProceso?: Date;
  avance?: string;
  todo: string;
  costo: number;
  tipo: string;
  fireBaseToken?: string;
}


export interface TrabajoTallerResponse {
  id?: number;
  cliente: Cliente;
  referencia: string;
  equipo: string;
  problema: string;
  solucion?: string;
  estado: number;
  bdeleted?: boolean;
  usuario: Usuario;
  fecha?: Date;
  dtProceso?: Date;
  avance?: string;
  todo: string;
  costo: number;
  tipo: string;
  fireBaseToken?: string;
}


export enum TIPO_TALLER {
  SERVIDOR,
  PC,
  PORTATIL,
  DISPOSITIVO,
  OTRO,
}
