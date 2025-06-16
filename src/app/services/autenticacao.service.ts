import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { resetPasswordForm, Usuario, Usuario_login, Usuario_registro } from '../lib/types';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private urlDoModel = `${import.meta.env.NG_APP_URL_DA_API}`;
  httpClient: HttpClient = inject(HttpClient);

  public isAutenticado = false;

  registrar(usuario: Usuario_registro): Observable<Usuario> {
    return this.httpClient.post<Usuario>(`${this.urlDoModel}/Auth/register`, usuario);
  }

  login(usuario: Usuario_login, useCookies: boolean = true): Observable<any> {
    return this.httpClient.post<Usuario>(`${this.urlDoModel}/login?useCookies=${useCookies}`, usuario, { withCredentials: true });
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(`${this.urlDoModel}/Auth/logout`, { withCredentials: true }).pipe(
      tap(() => {
        this.isAutenticado = false;
      })
    );
  }

  forgotPassword(email: string): Observable<void> {
    return this.httpClient.post<void>(`${this.urlDoModel}/Auth/forgotPassword`, { email });
  }

  resetPassword(data: resetPasswordForm): Observable<void> {
    return this.httpClient.post<void>(`${this.urlDoModel}/Auth/resetPassword`, data);
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

  getUser(): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.urlDoModel}/Auth/getUser`, { withCredentials: true });
  }
}
