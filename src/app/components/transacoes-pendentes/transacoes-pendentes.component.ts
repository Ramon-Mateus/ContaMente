import { CommonModule } from '@angular/common'
import { Component, inject, NgZone, OnDestroy, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { ToastrService } from 'ngx-toastr'
import {
  Cartao,
  Categoria,
  PluggyConta,
  PluggyItem,
  PostMovimentacao,
  PreenchimentoParcela,
  Responsavel,
  StatusTransacaoPendente,
  TipoPagamento,
  TransacaoPendente,
} from '../../lib/types'
import { PluggyService } from '../../services/pluggy.service'
import { CartaoService } from '../../services/cartao.service'
import { CategoriaService } from '../../services/categoria.service'
import { ResponsavelService } from '../../services/responsavel.service'
import { TipoPagamentoService } from '../../services/tipo-pagamento.service'
import { MovimentacaoModalComponent } from '../movimentacao-modal/movimentacao-modal.component'

const TIPO_PAGAMENTO_CREDITO = 1
const INTERVALO_ATUALIZACAO_MS = 60_000

@Component({
  selector: 'app-transacoes-pendentes',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, MovimentacaoModalComponent],
  templateUrl: './transacoes-pendentes.component.html',
})
export class TransacoesPendentesComponent implements OnInit, OnDestroy {
  private pluggyService = inject(PluggyService)
  private cartaoService = inject(CartaoService)
  private categoriaService = inject(CategoriaService)
  private responsavelService = inject(ResponsavelService)
  private tipoPagamentoService = inject(TipoPagamentoService)
  private toastr = inject(ToastrService)
  private zone = inject(NgZone)

  readonly Status = StatusTransacaoPendente

  itens: PluggyItem[] = []
  transacoes: TransacaoPendente[] = []
  statusAtual: StatusTransacaoPendente = StatusTransacaoPendente.Pendente
  carregando = false
  sincronizando = false
  conectando = false

  categorias: Categoria[] = []
  responsaveis: Responsavel[] = []
  cartoes: Cartao[] = []
  tiposPagamento: TipoPagamento[] = []

  visibleModal = false
  transacaoSelecionadaId = 0
  preenchimento: PostMovimentacao | null = null
  preenchimentoParcela: PreenchimentoParcela | null = null

  private timer?: ReturnType<typeof setInterval>

  get totalSelecionado(): number {
    return this.transacoes.reduce((s, t) => s + this.valorDaCompra(t), 0)
  }

  ngOnInit() {
    this.carregarItens()
    this.carregarTransacoes()
    this.categoriaService.getCategorias(false).subscribe((c) => (this.categorias = c))
    this.tipoPagamentoService.getTiposPagamento().subscribe((t) => (this.tiposPagamento = t))
    this.responsavelService.getResponsaveis().subscribe((r) => {
      this.responsaveis = [{ id: 0, nome: 'Eu', userId: '', user: null, movimentacoes: [] }, ...r]
    })
    this.cartaoService.getCartoes().subscribe((c) => {
      this.cartoes = [{ id: 0, apelido: 'Nenhum', diaFechamento: 0 }, ...c]
    })

    // O backend consulta o Pluggy periodicamente; aqui só recarregamos a lista.
    this.timer = setInterval(() => {
      if (!this.visibleModal) this.carregarTransacoes(true)
    }, INTERVALO_ATUALIZACAO_MS)
  }

  ngOnDestroy() {
    clearInterval(this.timer)
  }

  carregarItens() {
    this.pluggyService.getItens().subscribe((itens) => (this.itens = itens))
  }

  carregarTransacoes(silencioso = false) {
    if (!silencioso) this.carregando = true
    this.pluggyService.getTransacoes(this.statusAtual).subscribe({
      next: (t) => {
        this.transacoes = t
        this.carregando = false
      },
      error: () => (this.carregando = false),
    })
  }

  mudarStatus(status: StatusTransacaoPendente) {
    this.statusAtual = status
    this.carregarTransacoes()
  }

  conectar(item?: PluggyItem) {
    this.conectando = true
    this.pluggyService.getConnectToken(item?.pluggyItemId).subscribe({
      next: (token) => {
        this.pluggyService
          .abrirConnect(
            token,
            {
              onSuccess: (itemId) =>
                this.zone.run(() => {
                  this.pluggyService.registrarItem(itemId).subscribe(() => {
                    this.toastr.success('Conexão realizada! Importando as transações...')
                    this.carregarItens()
                    setTimeout(() => {
                      this.carregarItens()
                      this.carregarTransacoes(true)
                    }, 8000)
                  })
                }),
              onError: (erro) =>
                this.zone.run(() => {
                  console.error('Pluggy Connect:', erro)
                  this.toastr.error('Não foi possível concluir a conexão.')
                }),
              onClose: () => this.zone.run(() => (this.conectando = false)),
            },
            item?.pluggyItemId
          )
          .catch((e) => {
            this.toastr.error(e.message)
            this.conectando = false
          })
          .finally(() => (this.conectando = false))
      },
      error: () => (this.conectando = false),
    })
  }

  removerItem(item: PluggyItem) {
    if (!confirm(`Remover a conexão com ${item.nomeConector ?? 'o banco'}? As transações ainda não aprovadas serão descartadas.`))
      return
    this.pluggyService.removerItem(item.id).subscribe(() => {
      this.carregarItens()
      this.carregarTransacoes()
    })
  }

  vincularCartao(conta: PluggyConta) {
    this.pluggyService.vincularCartao(conta.id, conta.cartaoId || null).subscribe(() => {
      this.toastr.success('Cartão vinculado')
      this.carregarTransacoes(true)
    })
  }

  sincronizar() {
    this.sincronizando = true
    this.pluggyService.sincronizar().subscribe({
      next: () => {
        this.sincronizando = false
        this.carregarItens()
        this.carregarTransacoes()
      },
      error: () => (this.sincronizando = false),
    })
  }

  ehParcelada(t: TransacaoPendente): boolean {
    return (t.totalParcelas ?? 1) > 1
  }

  valorDaCompra(t: TransacaoPendente): number {
    return this.ehParcelada(t) ? t.valorTotal ?? t.valor * t.totalParcelas! : t.valor
  }

  aprovar(t: TransacaoPendente) {
    const parcelada = this.ehParcelada(t)
    this.transacaoSelecionadaId = t.id
    this.preenchimentoParcela = parcelada
      ? { numeroParcelas: t.totalParcelas!, valorParcela: t.valor }
      : null
    this.preenchimento = {
      valor: this.valorDaCompra(t),
      data: new Date(t.data),
      descricao: t.descricao,
      fixa: false,
      categoriaId: 0,
      tipoPagamentoId: TIPO_PAGAMENTO_CREDITO,
      responsavelId: null,
      cartaoId: t.cartaoSugeridoId,
    }
    this.visibleModal = false
    setTimeout(() => (this.visibleModal = true))
  }

  onAprovada() {
    this.visibleModal = false
    this.toastr.success('Movimentação adicionada')
    this.carregarTransacoes(true)
  }

  ignorar(t: TransacaoPendente) {
    this.pluggyService.ignorar(t.id).subscribe(() => this.carregarTransacoes(true))
  }

  restaurar(t: TransacaoPendente) {
    this.pluggyService.restaurar(t.id).subscribe(() => this.carregarTransacoes(true))
  }
}
