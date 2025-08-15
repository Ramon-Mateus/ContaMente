import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostPutResponsavel, Responsavel } from '../lib/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsavelService {
  private urlDaApi = import.meta.env.NG_APP_URL_DA_API;
  private urlDoModel = `${this.urlDaApi}/api/Responsavel`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getResponsaveis(): Observable<Responsavel[]> {
    return this.httpClient.get<Responsavel[]>(this.urlDoModel, { withCredentials: true });
  }

  getResponsavelById(id: number): Observable<Responsavel> {
    return this.httpClient.get<Responsavel>(`${this.urlDoModel}/${id}`, { withCredentials: true });
  }

  postResponsavel(responsavel: PostPutResponsavel): Observable<Responsavel> {
    return this.httpClient.post<Responsavel>(this.urlDoModel, responsavel, { withCredentials: true });
  }

  putResponsavel(id: number, responsavel: PostPutResponsavel): Observable<Responsavel> {
    return this.httpClient.put<Responsavel>(`${this.urlDoModel}/${id}`, responsavel, { withCredentials: true });
  }

  deleteResponsavel(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlDoModel}/${id}`, { withCredentials: true });
  }
}
