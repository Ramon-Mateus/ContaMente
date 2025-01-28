import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Usuario, Usuario_login } from '../lib/types';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private urlDoModel = `${import.meta.env.NG_APP_URL_DA_API}`;
  httpClient: HttpClient = inject(HttpClient);

  private isAutenticado = false;

  registrar(usuario: Usuario_login): Observable<Usuario> {
    return this.httpClient.post<Usuario>(`${this.urlDoModel}/register`, usuario);
  }

  login(usuario: Usuario_login, useCookies: boolean = true): Observable<any> {
    return this.httpClient.post<Usuario>(`${this.urlDoModel}/login?useCookies=${useCookies}`, usuario, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(`${this.urlDoModel}/Auth/logout`, {}).pipe(
      tap(() => {
        this.isAutenticado = false;
      })
    );
  }

  verificarSessao(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.urlDoModel}/Auth/verificarSessao`, { withCredentials: true }).pipe(
      tap((autenticado) => {
        this.isAutenticado = autenticado;
      })
    );
  }

  setAutenticado(status: boolean): void {
    this.isAutenticado = status;
  }

  constructor() { }
}
