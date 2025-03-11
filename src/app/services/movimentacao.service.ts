import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DiaFiscal, Movimentacao, PostMovimentacao } from '../lib/types';

@Injectable({
  providedIn: 'root'
})

export class MovimentacaoService {
  private urlDaApi = import.meta.env.NG_APP_URL_DA_API;
  private urlDoModel = `${this.urlDaApi}/api/Movimentacao`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getMovimentacoes(mes?: number, ano?: number, entrada?: boolean): Observable<{ movimentacoes: DiaFiscal[], total: number} > {
    let params = new HttpParams();

    if(mes) {
      params = params.set('mes', mes.toString());
    }

    if(ano) {
      params = params.set('ano', ano.toString());
    }

    if(entrada) {
      params = params.set('entrada', entrada.toString());
    }

    return this.httpClient.get<{ [Key: string]: Movimentacao[] }>(this.urlDoModel, { params, withCredentials: true }).pipe(
      map((response: { [key: string]: Movimentacao[] }) => {
        const movimentacoes: DiaFiscal[] = Object.keys(response).map(key => {
          return {
            data: new Date(key),
            movimentacoes: response[key]
          };
        });

        let total = 0;
        movimentacoes.forEach(dia => {
          dia.movimentacoes.forEach(movimentacao => {
            total += movimentacao.valor;
          });
        });
  
        return { movimentacoes, total };
      })
    );
  }

  getMovimentacaoById(id: number): Observable<Movimentacao> {
    return this.httpClient.get<Movimentacao>(`${this.urlDoModel}/${id}`, { withCredentials: true });
  }

  postMovimentacao(movimentacao: PostMovimentacao): Observable<Movimentacao> {
    return this.httpClient.post<Movimentacao>(this.urlDoModel, movimentacao, { withCredentials: true });
  }

  putMovimentacao(id: number, movimentacao: Movimentacao): Observable<Movimentacao> {
    return this.httpClient.put<Movimentacao>(`${this.urlDoModel}/${id}`, movimentacao, { withCredentials: true });
  }

  deleteMovimentacao(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlDoModel}/${id}`, { withCredentials: true });
  }
}
