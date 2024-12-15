import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gasto, PostGasto } from '../lib/types';

@Injectable({
  providedIn: 'root'
})

export class GastoService {
  private porta_da_api = import.meta.env.NG_APP_PORTA_DA_API;
  private protocolo = import.meta.env.NG_APP_PROTOCOLO;
  private apiUrl = `${this.protocolo}://localhost:${this.porta_da_api}/api/Gasto`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getGastos(mes?: number, ano?: number): Observable<Gasto[]> {
    let params = new HttpParams();

    if(mes) {
      params = params.set('mes', mes.toString());
    }

    if(ano) {
      params = params.set('ano', ano.toString());
    }

    return this.httpClient.get<Gasto[]>(this.apiUrl, { params });
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
