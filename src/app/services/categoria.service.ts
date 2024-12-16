import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../lib/types';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private urlDaApi = import.meta.env.NG_APP_URL_DA_API;
  private urlDoModel = `${this.urlDaApi}/api/Categoria`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getCategorias(): Observable<Categoria[]> {
    return this.httpClient.get<Categoria[]>(this.urlDoModel);
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.httpClient.get<Categoria>(`${this.urlDoModel}/${id}`);
  }

  postCategoria(categoria: Categoria): Observable<Categoria> {
    return this.httpClient.post<Categoria>(this.urlDoModel, categoria);
  }

  putCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.httpClient.put<Categoria>(`${this.urlDoModel}/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlDoModel}/${id}`);
  }
}
