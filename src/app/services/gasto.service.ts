import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gasto } from '../lib/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GastoService {
  private apiUrl = 'https://localhost:44376/api/Gasto';

  constructor(
    private httpClient: HttpClient
  ) { }

  getGastos(): Observable<Gasto[]> {
    return this.httpClient.get<Gasto[]>(this.apiUrl);
  }

  getGastoById(id: number): Observable<Gasto> {
    return this.httpClient.get<Gasto>(`${this.apiUrl}/${id}`);
  }

  postGasto(gasto: Gasto): Observable<Gasto> {
    return this.httpClient.post<Gasto>(this.apiUrl, gasto);
  }

  putGasto(id: number, gasto: Gasto): Observable<Gasto> {
    return this.httpClient.put<Gasto>(`${this.apiUrl}/${id}`, gasto);
  }

  deleteGasto(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
