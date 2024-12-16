import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Gasto, PostGasto } from '../lib/types';

@Injectable({
  providedIn: 'root'
})

export class GastoService {
  private urlDaApi = import.meta.env.NG_APP_URL_DA_API;
  private urlDoModel = `${this.urlDaApi}/api/Gasto`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getGastos(mes?: number, ano?: number): Observable<{ gastos: Gasto[], total: number} > {
    let params = new HttpParams();

    if(mes) {
      params = params.set('mes', mes.toString());
    }

    if(ano) {
      params = params.set('ano', ano.toString());
    }

    return this.httpClient.get<Gasto[]>(this.urlDoModel, { params }).pipe(
      map((gastos: Gasto[]) => {
        const total: number = gastos.reduce((sum: number, gasto: Gasto) => sum + gasto.valor!, 0);
        return { gastos, total };
      })
    );
  }

  getGastoById(id: number): Observable<Gasto> {
    return this.httpClient.get<Gasto>(`${this.urlDoModel}/${id}`);
  }

  postGasto(gasto: PostGasto): Observable<Gasto> {
    return this.httpClient.post<Gasto>(this.urlDoModel, gasto);
  }

  putGasto(id: number, gasto: Gasto): Observable<Gasto> {
    return this.httpClient.put<Gasto>(`${this.urlDoModel}/${id}`, gasto);
  }

  deleteGasto(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlDoModel}/${id}`);
  }
}
