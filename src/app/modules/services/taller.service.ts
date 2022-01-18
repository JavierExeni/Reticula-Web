import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import {
  TrabajoTaller,
  TrabajoTallerResponse,
} from '../../shared/models/trabajotaller';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TallerService {
  private baseUrl: string = environment.base_url;

  private _trabajos: TrabajoTallerResponse[] = [];

  get trabajos() {
    return [...this._trabajos];
  }

  constructor(private http: HttpClient) {}

  list(): Observable<TrabajoTallerResponse[]> {
    const url = `${this.baseUrl}taller`;
    return this.http.get<TrabajoTallerResponse[]>(url).pipe(
      tap((res) => {
        this._trabajos = res;
      })
    );
  }

  listByCliente(id: number){
    const url = `${this.baseUrl}taller/cliente/${id}`;
    return this.http.get(url);
  }

  insert(taller: TrabajoTaller) {
    const url = `${this.baseUrl}taller/insert`;
    return this.http.post(url, taller);
  }
}
