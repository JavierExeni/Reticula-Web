import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';
import { Usuario } from '../../shared/models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl: string = environment.base_url;

  private _usuarios: Usuario[] = [];

  get usuarios() {
    return [...this._usuarios];
  }

  constructor(private http: HttpClient) {}

  list(): Observable<Usuario[]> {
    const url = `${this.baseUrl}usuarios`;
    return this.http.get<Usuario[]>(url).pipe(
      tap((res) => {
        console.log(res);
        this._usuarios = res;
      })
    );
  }

  insert(usuario: Usuario) {
    const url = `${this.baseUrl}usuarios/insert`;
    return this.http.post(url, usuario);
  }
}
