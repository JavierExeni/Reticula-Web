import { Carpeta } from './carpeta';
import { TareasResponse } from './tareas';
export interface Documento {
  codigo_id?: number;
  titulo: string;
  path: string;
  tarea: TareasResponse;
  carpeta: Carpeta;
}
