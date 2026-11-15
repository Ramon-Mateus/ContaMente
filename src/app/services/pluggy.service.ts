import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map, Observable } from 'rxjs'
import {
  PluggyConta,
  PluggyItem,
  PostMovimentacao,
  StatusTransacaoPendente,
  TransacaoPendente,
} from '../lib/types'

declare global {
  interface Window {
    PluggyConnect?: any
  }
}

const PLUGGY_CONNECT_SCRIPT = 'https://cdn.pluggy.ai/pluggy-connect/v2.11.0/pluggy-connect.js'

@Injectable({
  providedIn: 'root',
})
export class PluggyService {
  private urlDaApi = import.meta.env.NG_APP_URL_DA_API
  private urlPluggy = `${this.urlDaApi}/api/Pluggy`
  private urlTransacoes = `${this.urlDaApi}/api/TransacaoPendente`
  private scriptCarregado?: Promise<void>

  constructor(private httpClient: HttpClient) {}

  // ---- Conexões ----
  getConnectToken(itemId?: string): Observable<string> {
    return this.httpClient
      .post<{ accessToken: string }>(
        `${this.urlPluggy}/connect-token`,
        { itemId: itemId ?? null },
        { withCredentials: true }
      )
      .pipe(map((r) => r.accessToken))
  }

  getItens(): Observable<PluggyItem[]> {
    return this.httpClient.get<PluggyItem[]>(`${this.urlPluggy}/itens`, {
      withCredentials: true,
    })
  }

  registrarItem(itemId: string): Observable<PluggyItem> {
    return this.httpClient.post<PluggyItem>(
      `${this.urlPluggy}/itens`,
      { itemId },
      { withCredentials: true }
    )
  }

  removerItem(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlPluggy}/itens/${id}`, {
      withCredentials: true,
    })
  }

  vincularCartao(contaId: number, cartaoId: number | null): Observable<PluggyConta> {
    return this.httpClient.put<PluggyConta>(
      `${this.urlPluggy}/contas/${contaId}/cartao`,
      { cartaoId },
      { withCredentials: true }
    )
  }

  sincronizar(): Observable<{ itens: number }> {
    return this.httpClient.post<{ itens: number }>(
      `${this.urlPluggy}/sincronizar`,
      {},
      { withCredentials: true }
    )
  }

  // ---- Transações importadas ----
  getTransacoes(status: StatusTransacaoPendente): Observable<TransacaoPendente[]> {
    return this.httpClient.get<TransacaoPendente[]>(this.urlTransacoes, {
      params: { status },
      withCredentials: true,
    })
  }

  contarPendentes(): Observable<number> {
    return this.httpClient
      .get<{ pendentes: number }>(`${this.urlTransacoes}/contagem`, {
        withCredentials: true,
      })
      .pipe(map((r) => r.pendentes))
  }

  aprovar(id: number, movimentacao: PostMovimentacao): Observable<{ movimentacaoId: number }> {
    return this.httpClient.post<{ movimentacaoId: number }>(
      `${this.urlTransacoes}/${id}/aprovar`,
      movimentacao,
      { withCredentials: true }
    )
  }

  ignorar(id: number): Observable<void> {
    return this.httpClient.post<void>(`${this.urlTransacoes}/${id}/ignorar`, {}, { withCredentials: true })
  }

  restaurar(id: number): Observable<void> {
    return this.httpClient.post<void>(`${this.urlTransacoes}/${id}/restaurar`, {}, { withCredentials: true })
  }

  // ---- Widget Pluggy Connect ----
  private carregarScript(): Promise<void> {
    if (window.PluggyConnect) return Promise.resolve()
    if (!this.scriptCarregado) {
      this.scriptCarregado = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = PLUGGY_CONNECT_SCRIPT
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => {
          this.scriptCarregado = undefined
          reject(new Error('Não foi possível carregar o Pluggy Connect.'))
        }
        document.body.appendChild(script)
      })
    }
    return this.scriptCarregado
  }

  async abrirConnect(
    connectToken: string,
    callbacks: { onSuccess: (itemId: string) => void; onError?: (erro: any) => void; onClose?: () => void },
    itemId?: string
  ) {
    await this.carregarScript()
    const pluggyConnect = new window.PluggyConnect({
      connectToken,
      includeSandbox: import.meta.env?.NG_APP_PLUGGY_SANDBOX === 'true',
      updateItem: itemId,
      onSuccess: (itemData: any) => callbacks.onSuccess(itemData.item.id),
      onError: (erro: any) => callbacks.onError?.(erro),
      onClose: () => callbacks.onClose?.(),
    })
    pluggyConnect.init()
  }
}
