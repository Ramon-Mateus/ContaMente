import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Parcela, postParcela } from '../lib/types';

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {
private urlDaApi = import.meta.env.NG_APP_URL_DA_API;
  private urlDoModel = `${this.urlDaApi}/api/Parcela`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getParcelas(): Observable<Parcela[]> {
    return this.httpClient.get<Parcela[]>(this.urlDoModel, { withCredentials: true });
  }

  getParcelaById(id: number): Observable<Parcela> {
    return this.httpClient.get<Parcela>(`${this.urlDoModel}/${id}`, { withCredentials: true });
  }

  postParcela(parcela: postParcela): Observable<Parcela> {
    return this.httpClient.post<Parcela>(this.urlDoModel, parcela, { withCredentials: true });
  }

  putParcela(id: number, parcela: Parcela): Observable<Parcela> {
    return this.httpClient.put<Parcela>(`${this.urlDoModel}/${id}`, parcela, { withCredentials: true });
  }

  deleteParcela(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlDoModel}/${id}`, { withCredentials: true });
  }
}
