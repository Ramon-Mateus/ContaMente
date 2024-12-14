import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gasto, PostGasto } from '../lib/types';

@Injectable({
  providedIn: 'root'
})

export class GastoService {
  private porta_da_api = import.meta.env.NG_APP_PORTA_DA_API;
  private apiUrl = `${this.porta_da_api}/api/Gasto`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getGastos(): Observable<Gasto[]> {
    return this.httpClient.get<Gasto[]>(this.apiUrl);
  }

  getGastoById(id: number): Observable<Gasto> {
    return this.httpClient.get<Gasto>(`${this.apiUrl}/${id}`);
  }

  postGasto(gasto: PostGasto): Observable<Gasto> {
    return this.httpClient.post<Gasto>(this.apiUrl, gasto);
  }

  putGasto(id: number, gasto: Gasto): Observable<Gasto> {
    return this.httpClient.put<Gasto>(`${this.apiUrl}/${id}`, gasto);
  }

  deleteGasto(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
