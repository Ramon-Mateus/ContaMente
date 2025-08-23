import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cartao, PostPutCartao } from '../lib/types';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {
  private urlDaApi = import.meta.env.NG_APP_URL_DA_API;
  private urlDoModel = `${this.urlDaApi}/api/Cartao`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getCartoes(): Observable<Cartao[]> {
    return this.httpClient.get<Cartao[]>(this.urlDoModel, { withCredentials: true });
  }

  getCartaoById(id: number): Observable<Cartao> {
    return this.httpClient.get<Cartao>(`${this.urlDoModel}/${id}`, { withCredentials: true });
  }

  postCartao(cartao: PostPutCartao): Observable<Cartao> {
    return this.httpClient.post<Cartao>(this.urlDoModel, cartao, { withCredentials: true });
  }

  putCartao(id: number, cartao: PostPutCartao): Observable<Cartao> {
    return this.httpClient.put<Cartao>(`${this.urlDoModel}/${id}`, cartao, { withCredentials: true });
  }

  deleteCartao(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlDoModel}/${id}`, { withCredentials: true });
  }
}
