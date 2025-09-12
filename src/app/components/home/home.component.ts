import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SidebarModule } from 'primeng/sidebar';
import { Cartao, Categoria, DiaFiscal, PostCategoria, Responsavel, TipoPagamento } from '../../lib/types';
import { CartaoService } from '../../services/cartao.service';
import { CategoriaService } from '../../services/categoria.service';
import { MovimentacaoService } from '../../services/movimentacao.service';
import { ParcelaService } from '../../services/parcela.service';
import { ResponsavelService } from '../../services/responsavel.service';
import { TipoPagamentoService } from '../../services/tipo-pagamento.service';
import { DiaFiscalComponent } from '../dia-fiscal/dia-fiscal.component';
import { FiltrosComponent } from '../filtros/filtros.component';
import { MovimentacaoModalComponent } from '../movimentacao-modal/movimentacao-modal.component';

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
    FiltrosComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  movimentacaoService: MovimentacaoService = inject(MovimentacaoService);
  categoriaService: CategoriaService = inject(CategoriaService);
  tiposPagamentoService: TipoPagamentoService = inject(TipoPagamentoService);
  parcelaService: ParcelaService = inject(ParcelaService);
  responsavelService: ResponsavelService = inject(ResponsavelService);
  cartaoService: CartaoService = inject(CartaoService);

  dias: DiaFiscal [] = [];

  selectedCategorias: number[] = [];
  selectedTiposPagamento: number[] = [];
  selectedResponsaveis: number[] = [];
  selectedCartoes: number[] = [];

  categorias: Categoria[] = [];
  categoriasSaidaFiltro: Categoria[] = [];
  categoriasEntradaFiltro: Categoria[] = [];
  tiposPagamento: TipoPagamento[] = [];
  totalMovimentacoes: number = 0;
  visibleModalMovimentacao: boolean = false;
  visibleModalCategoria: boolean = false;
  entradaCategoria: boolean = false;
  entradaMovimentacaoFiltro: boolean = false;
  movimentacaoParcelada: boolean = false;
  numeroParcelas: number = 2;
  valorParcela: number = 0;
  labelValor: string = 'Valor:';
  idMovimentacao: number = 0;
  responsaveis: Responsavel[] = [];
  cartoes: Cartao[] = [];

  newCategoria: PostCategoria = { nome: '', entrada: false };

  dataDeFiltragem = new Date()

  sidebarVisible = false;
  
  constructor() {}
  
  ngOnInit() {
    this.movimentacaoService.modificouFiltros.subscribe((dias)=>{
      this.dias = dias

      let somaMovs = 0

      dias.forEach((d)=>{
        d.movimentacoes.forEach((mov)=>{
          somaMovs += mov.valor
        })
      })

      this.totalMovimentacoes
    })

    this.getMovimentacoes();
    this.getCategorias();
    this.getTiposPagamento();
    this.getResponsaveis();
    this.getCartoes();
  }

  showDialogMovimentacao() {
    this.visibleModalMovimentacao = false;
    setTimeout(() => {
      this.visibleModalMovimentacao = true;
    }, 0);
  }

  showDialogCategoria() {
    this.visibleModalCategoria = true;
  }

  onCreateMovimentacaoModal() {
    this.idMovimentacao = 0;
    this.showDialogMovimentacao();
  }

  OnCreateCategoriaSubmit() {
    this.categoriaService.postCategoria(this.newCategoria)
      .subscribe(categoria => {
        this.getMovimentacoes();
        this.getCategorias();
        this.newCategoria = { nome: '', entrada: false };
        this.visibleModalCategoria = false;
      });
  }

  onDeleteMovimentacao(id: number) {
    this.movimentacaoService.deleteMovimentacao(id).subscribe(() => {
      this.getMovimentacoes();
    });
  }

  onEditMovimentacao(idMovimentacao: number) {
    this.idMovimentacao = idMovimentacao;
    this.showDialogMovimentacao();
  }

  getMovimentacoes() {
    this.movimentacaoService.getMovimentacoes(this.dataDeFiltragem.getMonth()+1, this.dataDeFiltragem.getFullYear(), this.entradaMovimentacaoFiltro, this.selectedCategorias, this.selectedTiposPagamento, this.selectedResponsaveis, this.selectedCartoes).subscribe(response => {
      this.dias = response.movimentacoes;
      this.totalMovimentacoes = response.total;
    });
  }

  onChangeEntradaMovimentacao() {
    this.categoriasEntradaFiltro = this.categoriasEntradaFiltro.map(categoria => ({ ...categoria, selected: false }));
    this.categoriasSaidaFiltro = this.categoriasSaidaFiltro.map(categoria => ({ ...categoria, selected: false }));

    this.onFilterChange();
  }

  getCategorias() {
    this.categoriaService.getCategorias(this.entradaCategoria).subscribe(categorias => {
      this.categorias = categorias;
    });

    this.categoriaService.getCategorias(false).subscribe(categorias => {
      this.categoriasSaidaFiltro = categorias.map(categoria => ({ ...categoria, selected: false }));
    });

    this.categoriaService.getCategorias(true).subscribe(categorias => {
      this.categoriasEntradaFiltro = categorias.map(categoria => ({ ...categoria, selected: false }));
    });
  }

  getTiposPagamento() {
    this.tiposPagamentoService.getTiposPagamento().subscribe(tiposPagamento => {
      this.tiposPagamento = tiposPagamento.map(tipoPagamento => ({ ...tipoPagamento, selected: false }));
    });
  }

  getResponsaveis() {
    this.responsavelService.getResponsaveis().subscribe(responsaveis => {
      this.responsaveis = [
        { id: 0, nome: 'Eu', userId: '', user: null, movimentacoes: [] },
        ...responsaveis
      ];

      this.responsaveis = this.responsaveis.map(responsavel => ({ ...responsavel, selected: false }));
    });
  }

  getCartoes() {
    this.cartaoService.getCartoes().subscribe(cartoes => {
      this.cartoes = [
        { id: 0, apelido: 'Nenhum', diaFechamento: 0 },
        ...cartoes
      ];

      this.cartoes = this.cartoes.map(cartao => ({ ...cartao, selected: false }));
    });
  }

  onFilterChange() {
    const categoriasEntradaSelecionadas = this.categoriasEntradaFiltro
    .filter(categoria => categoria.selected)
    .map(categoria => categoria.id);

    const categoriasSaidaSelecionadas = this.categoriasSaidaFiltro
      .filter(categoria => categoria.selected)
      .map(categoria => categoria.id);

    this.selectedCategorias = [
      ...categoriasEntradaSelecionadas,
      ...categoriasSaidaSelecionadas
    ].filter((id): id is number => id !== undefined);

    this.selectedTiposPagamento = this.tiposPagamento.filter(t => t.selected).map(t => t.id);

    this.selectedResponsaveis = this.responsaveis.filter(r => r.selected).map(r => r.id);

    this.selectedCartoes = this.cartoes.filter(c => c.selected).map(c => c.id);

    this.getMovimentacoes();
  }
}
