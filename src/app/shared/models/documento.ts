import { Carpeta } from './carpeta';
import { TareasResponse } from './tareas';
export interface Documento {
  id?: number;
  titulo: string;
  path: string;
  tarea: TareasResponse;
  carpeta: Carpeta;
}
