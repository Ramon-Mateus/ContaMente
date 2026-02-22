import { CommonModule } from '@angular/common'
import { Component, inject, ViewChild } from '@angular/core'
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
  Movimentacao,
  Responsavel,
  TipoPagamento,
} from '../../lib/types'
import { CartaoService } from '../../services/cartao.service'
import { CategoriaService } from '../../services/categoria.service'
import { MovimentacaoService } from '../../services/movimentacao.service'
import { ParcelaService } from '../../services/parcela.service'
import { ResponsavelService } from '../../services/responsavel.service'
import { TipoPagamentoService } from '../../services/tipo-pagamento.service'
import { PdfExportService } from '../../services/pdf-export.service'
import { DiaFiscalComponent } from '../dia-fiscal/dia-fiscal.component'
import { FiltrosComponent } from '../filtros/filtros.component'
import { MovimentacaoModalComponent } from '../movimentacao-modal/movimentacao-modal.component'
import { PaginatorModule } from 'primeng/paginator'

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
    PaginatorModule,
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
  pdfExportService: PdfExportService = inject(PdfExportService)

  @ViewChild(FiltrosComponent) filtrosComponent!: FiltrosComponent

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

  sidebarVisible = false

  // Paginação
  first: number = 0
  rows: number = 10
  totalRecordsMovimentacoes: number = 0
  allFlatMovimentacoes: { data: Date; movimentacao: Movimentacao }[] = []
  paginatedDias: DiaFiscal[] = []

  constructor() { }

  ngOnInit() {
    this.movimentacaoService.modificouFiltros.subscribe((dias) => {
      this.processDias(dias)
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
      this.processDias(data.movimentacoes)
      this.totalMovimentacoes = data.total
    })
  }

  processDias(dias: DiaFiscal[]) {
    this.dias = dias

    let somaMovs = 0
    let flatMovs: { data: Date; movimentacao: Movimentacao }[] = []

    dias.forEach((d) => {
      d.movimentacoes.forEach((mov) => {
        somaMovs += mov.valor
        flatMovs.push({ data: new Date(d.data), movimentacao: mov })
      })
    })

    this.totalMovimentacoes = somaMovs
    this.allFlatMovimentacoes = flatMovs
    this.totalRecordsMovimentacoes = flatMovs.length

    // reset pagination
    this.first = 0
    this.updatePaginatedDias()
  }

  onPageChange(event: any) {
    this.first = event.first
    this.rows = event.rows
    this.updatePaginatedDias()
  }

  updatePaginatedDias() {
    const start = this.first
    const end = this.first + this.rows
    const paginatedFlat = this.allFlatMovimentacoes.slice(start, end)

    const newDias: DiaFiscal[] = []
    paginatedFlat.forEach((flat) => {
      const last = newDias[newDias.length - 1]
      if (!last || last.data.getTime() !== flat.data.getTime()) {
        newDias.push({ data: flat.data, movimentacoes: [flat.movimentacao] })
      } else {
        last.movimentacoes.push(flat.movimentacao)
      }
    })

    this.paginatedDias = newDias
  }

  exportarPDF() {
    // Obter período atual (mês/ano) do componente de filtros
    const dataFiltro = this.filtrosComponent?.dataDeFiltragem || new Date()
    const periodo = dataFiltro.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    })

    // Chamar serviço de exportação
    this.pdfExportService.exportMovimentacoesPDF(
      this.dias,
      this.totalMovimentacoes,
      periodo
    )
  }
}
