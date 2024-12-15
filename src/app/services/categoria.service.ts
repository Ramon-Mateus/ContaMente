import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../lib/types';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private porta_da_api = import.meta.env.NG_APP_PORTA_DA_API;
  private protocolo = import.meta.env.NG_APP_PROTOCOLO;
  private apiUrl = `${this.protocolo}://localhost:${this.porta_da_api}/api/Categoria`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getCategorias(): Observable<Categoria[]> {
    return this.httpClient.get<Categoria[]>(this.apiUrl);
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.httpClient.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  postCategoria(categoria: Categoria): Observable<Categoria> {
    return this.httpClient.post<Categoria>(this.apiUrl, categoria);
  }

  putCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.httpClient.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
