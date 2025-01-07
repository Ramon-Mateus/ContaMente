import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../lib/types';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private urlDoModel = `${import.meta.env.NG_APP_URL_DA_API}/api/Categoria`;
  httpClient: HttpClient = inject(HttpClient);

  cadastrar(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.urlDoModel, usuario);
  }

  constructor() { }
}
