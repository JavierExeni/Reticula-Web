import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../../shared/models/clientes';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private baseUrl: string = environment.base_url;

  private _clientes: Cliente[] = [];

  get clientes() {
    return [...this._clientes];
  }

  constructor(private http: HttpClient) {}

  list(): Observable<Cliente[]> {
    const url = `${this.baseUrl}clientes`;
    return this.http.get<Cliente[]>(url).pipe(
      tap((res) => {
        this._clientes = res;
      })
    );
  }

  insert(cliente: Cliente) {
    const url = `${this.baseUrl}clientes/insert`;
    return this.http.post(url, cliente);
  }
}
