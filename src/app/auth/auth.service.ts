import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { Login, AuthResponse, Usuario } from '../shared/models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.base_url;

  private _usuario!: Usuario;

  get usuario() {
    return this._usuario
      ? this._usuario
      : JSON.parse(localStorage.getItem('user')!);
  }

  constructor(private http: HttpClient) {}

  login(login: Login): Observable<AuthResponse> {
    const url = `${this.baseUrl}usuarios/login`;
    return this.http.post<AuthResponse>(url, login).pipe(
      tap((res) => {
        console.log(res);
        localStorage.setItem('user', JSON.stringify(res.data));
        this._usuario = res.data;
      })
    );
  }
}