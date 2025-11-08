import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CalendarModule } from 'primeng/calendar'
import { DialogModule } from 'primeng/dialog'
import { InputSwitchModule } from 'primeng/inputswitch'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { SidebarModule } from 'primeng/sidebar'
import {
  Cartao,
  Categoria,
  DiaFiscal,
  Responsavel,
  TipoPagamento,
} from '../../lib/types'
import { CartaoService } from '../../services/cartao.service'
import { CategoriaService } from '../../services/categoria.service'
import { MovimentacaoService } from '../../services/movimentacao.service'
import { ParcelaService } from '../../services/parcela.service'
import { ResponsavelService } from '../../services/responsavel.service'
import { TipoPagamentoService } from '../../services/tipo-pagamento.service'
import { DiaFiscalComponent } from '../dia-fiscal/dia-fiscal.component'
import { FiltrosComponent } from '../filtros/filtros.component'
import { MovimentacaoModalComponent } from '../movimentacao-modal/movimentacao-modal.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextareaModule,
    InputSwitchModule,
    CalendarModule,
    DialogModule,
    DiaFiscalComponent,
    MovimentacaoModalComponent,
    SidebarModule,
    FiltrosComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  movimentacaoService: MovimentacaoService = inject(MovimentacaoService)
  categoriaService: CategoriaService = inject(CategoriaService)
  tiposPagamentoService: TipoPagamentoService = inject(TipoPagamentoService)
  parcelaService: ParcelaService = inject(ParcelaService)
  responsavelService: ResponsavelService = inject(ResponsavelService)
  cartaoService: CartaoService = inject(CartaoService)

  dias: DiaFiscal[] = []

  categorias: Categoria[] = []
  tiposPagamento: TipoPagamento[] = []
  totalMovimentacoes: number = 0
  visibleModalMovimentacao: boolean = false
  entradaCategoria: boolean = false
  entradaMovimentacaoFiltro: boolean = false
  movimentacaoParcelada: boolean = false
  numeroParcelas: number = 2
  valorParcela: number = 0
  labelValor: string = 'Valor:'
  idMovimentacao: number = 0
  responsaveis: Responsavel[] = []
  cartoes: Cartao[] = []

  dataDeFiltragem = new Date()

  sidebarVisible = false

  constructor() {}

  ngOnInit() {
    this.movimentacaoService.modificouFiltros.subscribe((dias) => {
      this.dias = dias

      let somaMovs = 0

      dias.forEach((d) => {
        d.movimentacoes.forEach((mov) => {
          somaMovs += mov.valor
        })
      })

      this.totalMovimentacoes = somaMovs
    })

    this.getCategorias()
    this.getTiposPagamento()
    this.getResponsaveis()
    this.getCartoes()
  }

  showDialogMovimentacao() {
    this.visibleModalMovimentacao = false
    setTimeout(() => {
      this.visibleModalMovimentacao = true
    }, 0)
  }

  onCreateMovimentacaoModal() {
    this.idMovimentacao = 0
    this.showDialogMovimentacao()
  }

  onDeleteMovimentacao(id: number) {
    this.movimentacaoService.deleteMovimentacao(id).subscribe(() => {
      this.refresh()
    })
  }

  onEditMovimentacao(idMovimentacao: number) {
    this.idMovimentacao = idMovimentacao
    this.showDialogMovimentacao()
  }

  getCategorias() {
    this.categoriaService
      .getCategorias(this.entradaCategoria)
      .subscribe((categorias) => {
        this.categorias = categorias
      })
  }

  getTiposPagamento() {
    this.tiposPagamentoService
      .getTiposPagamento()
      .subscribe((tiposPagamento) => {
        this.tiposPagamento = tiposPagamento
      })
  }

  getResponsaveis() {
    this.responsavelService.getResponsaveis().subscribe((responsaveis) => {
      this.responsaveis = [
        {
          id: 0,
          nome: 'Eu',
          userId: '',
          user: null,
          movimentacoes: [],
        },
        ...responsaveis,
      ]
    })
  }

  getCartoes() {
    this.cartaoService.getCartoes().subscribe((cartoes) => {
      this.cartoes = [
        { id: 0, apelido: 'Nenhum', diaFechamento: 0 },
        ...cartoes,
      ]
    })
  }

  refresh() {
    this.movimentacaoService.refresh().subscribe((data) => {
      this.dias = data.movimentacoes
      this.totalMovimentacoes = data.total
    })
  }
}
