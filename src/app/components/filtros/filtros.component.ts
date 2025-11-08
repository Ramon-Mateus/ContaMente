import { CommonModule } from '@angular/common'
import { Component, inject, Output, EventEmitter } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CalendarModule } from 'primeng/calendar'
import { DialogModule } from 'primeng/dialog'
import { InputSwitchModule } from 'primeng/inputswitch'
import { InputTextModule } from 'primeng/inputtext'
import {
    Cartao,
    Categoria,
    PostCategoria,
    Responsavel,
    TipoPagamento,
} from '../../lib/types'
import { CartaoService } from '../../services/cartao.service'
import { CategoriaService } from '../../services/categoria.service'
import { MovimentacaoService } from '../../services/movimentacao.service'
import { ResponsavelService } from '../../services/responsavel.service'
import { TipoPagamentoService } from '../../services/tipo-pagamento.service'
import { CategoriaModalComponent } from '../categoria-modal/categoria-modal.component'

@Component({
    selector: 'app-filtros',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CalendarModule,
        InputSwitchModule,
        DialogModule,
        InputTextModule,
        CategoriaModalComponent,
    ],
    templateUrl: './filtros.component.html',
})
export class FiltrosComponent {
    movimentacaoService: MovimentacaoService = inject(MovimentacaoService)
    categoriaService: CategoriaService = inject(CategoriaService)
    tiposPagamentoService: TipoPagamentoService = inject(TipoPagamentoService)
    cartaoService: CartaoService = inject(CartaoService)
    responsavelService: ResponsavelService = inject(ResponsavelService)

    @Output() categoriaAdicionadaEvent = new EventEmitter<void>()

    dataDeFiltragem = new Date()

    entradaCategoria: boolean = false
    entradaMovimentacaoFiltro: boolean = false
    categoriasSaidaFiltro: Categoria[] = []
    categoriasEntradaFiltro: Categoria[] = []
    categoriaId: number = 0

    categorias: Categoria[] = []
    newCategoria: PostCategoria = { nome: '', entrada: false }
    visibleModalCategoria: boolean = false
    selectedCategorias: number[] = []
    selectedTiposPagamento: number[] = []
    selectedResponsaveis: number[] = []
    selectedCartoes: number[] = []
    cartoes: Cartao[] = []

    responsaveis: Responsavel[] = []

    tiposPagamento: TipoPagamento[] = []

    getMovimentacoesAndEmiteEvento() {
        // dispara para atualizar a listagem de movs
        // (estou colocando no lugar de getMovimentacoes())

        this.movimentacaoService
            .getMovimentacoes(
                this.dataDeFiltragem.getMonth() + 1,
                this.dataDeFiltragem.getFullYear(),
                this.entradaMovimentacaoFiltro,
                this.selectedCategorias,
                this.selectedTiposPagamento,
                this.selectedResponsaveis,
                this.selectedCartoes
            )
            .subscribe((response) => {
                this.movimentacaoService.modificouFiltros.emit(
                    response.movimentacoes
                )
            })
    }

    ngOnInit() {
        this.getMovimentacoesAndEmiteEvento()
        this.getCategorias()
        this.getTiposPagamento()
        this.getResponsaveis()
        this.getCartoes()
    }

    OnCreateCategoriaSubmit() {
        this.categoriaService
            .postCategoria(this.newCategoria)
            .subscribe((categoria) => {
                this.getMovimentacoesAndEmiteEvento()
                this.getCategorias()
                this.newCategoria = { nome: '', entrada: false }
                this.visibleModalCategoria = false
                this.categoriaAdicionadaEvent.emit()
            })
    }

    getCategorias() {
        this.visibleModalCategoria = false

        this.categoriaService
            .getCategorias(this.entradaCategoria)
            .subscribe((categorias) => {
                this.categorias = categorias
            })

        this.categoriaService.getCategorias(false).subscribe((categorias) => {
            this.categoriasSaidaFiltro = categorias.map((categoria) => ({
                ...categoria,
                selected: false,
            }))
        })

        this.categoriaService.getCategorias(true).subscribe((categorias) => {
            this.categoriasEntradaFiltro = categorias.map((categoria) => ({
                ...categoria,
                selected: false,
            }))
        })
    }

    getTiposPagamento() {
        this.tiposPagamentoService
            .getTiposPagamento()
            .subscribe((tiposPagamento) => {
                this.tiposPagamento = tiposPagamento.map((tipoPagamento) => ({
                    ...tipoPagamento,
                    selected: false,
                }))
            })
    }

    getCartoes() {
        this.cartaoService.getCartoes().subscribe((cartoes) => {
            this.cartoes = [
                { id: 0, apelido: 'Nenhum', diaFechamento: 0 },
                ...cartoes,
            ]

            this.cartoes = this.cartoes.map((cartao) => ({
                ...cartao,
                selected: false,
            }))
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

            this.responsaveis = this.responsaveis.map((responsavel) => ({
                ...responsavel,
                selected: false,
            }))
        })
    }

    showDialogCategoria() {
        this.visibleModalCategoria = false
        setTimeout(() => {
            this.visibleModalCategoria = true
        }, 0)
    }

    onChangeEntradaMovimentacao() {
        this.categoriasEntradaFiltro = this.categoriasEntradaFiltro.map(
            (categoria) => ({ ...categoria, selected: false })
        )
        this.categoriasSaidaFiltro = this.categoriasSaidaFiltro.map(
            (categoria) => ({ ...categoria, selected: false })
        )

        this.onFilterChange()
    }

    onFilterChange() {
        const categoriasEntradaSelecionadas = this.categoriasEntradaFiltro
            .filter((categoria) => categoria.selected)
            .map((categoria) => categoria.id)

        const categoriasSaidaSelecionadas = this.categoriasSaidaFiltro
            .filter((categoria) => categoria.selected)
            .map((categoria) => categoria.id)

        this.selectedCategorias = [
            ...categoriasEntradaSelecionadas,
            ...categoriasSaidaSelecionadas,
        ].filter((id): id is number => id !== undefined)

        this.selectedTiposPagamento = this.tiposPagamento
            .filter((t) => t.selected)
            .map((t) => t.id)

        this.selectedResponsaveis = this.responsaveis
            .filter((r) => r.selected)
            .map((r) => r.id)

        this.selectedCartoes = this.cartoes
            .filter((c) => c.selected)
            .map((c) => c.id)

        this.getMovimentacoesAndEmiteEvento()
    }

    onCategoriaSubmit() {
        this.getCategorias()
        this.categoriaAdicionadaEvent.emit()
    }
}
