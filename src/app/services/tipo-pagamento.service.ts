import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { TipoPagamento } from '../lib/types'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TipoPagamentoService {
  private urlDaApi = import.meta.env.NG_APP_URL_DA_API
  private urlDoModel = `${this.urlDaApi}/api/TipoPagamento`

  constructor(private httpClient: HttpClient) {}

  getTiposPagamento(): Observable<TipoPagamento[]> {
    return this.httpClient.get<TipoPagamento[]>(this.urlDoModel, {
      withCredentials: true,
    })
  }

  getTipoPagamentoById(id: number): Observable<TipoPagamento> {
    return this.httpClient.get<TipoPagamento>(`${this.urlDoModel}/${id}`, {
      withCredentials: true,
    })
  }
}
