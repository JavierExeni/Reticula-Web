import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tareas, TareasResponse } from '../../shared/models/tareas';
import { environment } from '../../../environments/environment.prod';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private baseUrl: string = environment.base_url;

  private _tareas: TareasResponse[] = [];

  get tareas() {
    return [...this._tareas];
  }

  constructor(private http: HttpClient) {}

  list(): Observable<TareasResponse[]> {
    const url = `${this.baseUrl}tareas`;
    return this.http.get<TareasResponse[]>(url).pipe(
      tap((res) => {
        this._tareas = res;
      })
    );
  }


  listByClienteTareasAsistencias(id: number){
    const url = `${this.baseUrl}tareas/asistencias-tareas/cliente/${id}`;
    return this.http.get<TareasResponse[]>(url);
  }

  listByClienteMantenimiento(id: number){
    const url = `${this.baseUrl}tareas/mantenimientos/cliente/${id}`;
    return this.http.get<TareasResponse[]>(url);
  }


  insert(tarea: Tareas) {
    const url = `${this.baseUrl}tareas/insert`;
    return this.http.post(url, tarea);
  }


  delete(id: number){
    const url = `${this.baseUrl}tareas/${id}`;
    return this.http.delete(url);
  }

}
