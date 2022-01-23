import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Carpeta } from '../../shared/models/carpeta';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CarpetaService {
  private baseUrl: string = environment.base_url;

  _carpetas: Carpeta[] = [];

  get carpetas() {
    return [...this._carpetas];
  }

  constructor(private http: HttpClient) {}

  list(): Observable<Carpeta[]> {
    const url = `${this.baseUrl}carpetas`;
    return this.http.get<Carpeta[]>(url).pipe(
      tap((res) => {
        this._carpetas = res;
      })
    );
  }

  insert(carpeta: Carpeta) {
    const url = `${this.baseUrl}carpetas/insert`;
    return this.http.post(url, carpeta);
  }

  subirDocumento(tarea: number, carpeta: number, file: File) {
    const url = `${this.baseUrl}anexos/insert`;

    console.log(tarea, carpeta);
    console.log(file);



    const fd = new FormData();
    fd.append('tarea', tarea.toString());
    fd.append('carpeta', carpeta.toString());
    fd.append('File', file);
    return this.http.post(url, fd);
  }

  documentoByCliente(id: number) {
    const url = `${this.baseUrl}anexos/cliente/${id}`;
    return this.http.get(url);
  }

  validarCarpeta(id: number) {
    const url = `${this.baseUrl}carpetas/cliente/${id}`;
    return this.http.get(url);
  }
}
