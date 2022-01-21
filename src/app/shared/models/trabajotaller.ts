import { Usuario } from './usuario';
import { Cliente } from './clientes';

export interface TrabajoTaller {
  codigo_id?: number;
  cliente: {
    lpersona_id: number;
    nombre?: string;
  };
  referencia: string;
  equipo: string;
  problema: string;
  solucion?: string;
  estado: number;
  bdeleted?: boolean;
  usuario: {
    codigo_id: number;
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
  codigo_id?: number;
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
