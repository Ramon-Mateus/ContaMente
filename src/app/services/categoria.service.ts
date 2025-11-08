import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Categoria, PutCategoria } from '../lib/types'

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private urlDaApi = import.meta.env.NG_APP_URL_DA_API
  private urlDoModel = `${this.urlDaApi}/api/Categoria`

  constructor(private httpClient: HttpClient) {}

  getCategorias(entrada?: boolean): Observable<Categoria[]> {
    let params = new HttpParams()

    if (entrada) {
      params = params.set('entrada', entrada.toString())
    }

    return this.httpClient.get<Categoria[]>(this.urlDoModel, {
      params,
      withCredentials: true,
    })
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.httpClient.get<Categoria>(`${this.urlDoModel}/${id}`, {
      withCredentials: true,
    })
  }

  postCategoria(categoria: Categoria): Observable<Categoria> {
    return this.httpClient.post<Categoria>(this.urlDoModel, categoria, {
      withCredentials: true,
    })
  }

  putCategoria(id: number, categoria: PutCategoria): Observable<Categoria> {
    return this.httpClient.put<Categoria>(
      `${this.urlDoModel}/${id}`,
      categoria,
      { withCredentials: true }
    )
  }

  deleteCategoria(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlDoModel}/${id}`, {
      withCredentials: true,
    })
  }
}
