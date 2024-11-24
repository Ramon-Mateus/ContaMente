import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../lib/types';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:5110/api/Categoria';

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
