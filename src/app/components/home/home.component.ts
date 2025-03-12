import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { map } from 'rxjs';
import { Categoria, DiaFiscal, Movimentacao, PostCategoria, PostMovimentacao, postParcela, TipoPagamento } from '../../lib/types';
import { CategoriaService } from '../../services/categoria.service';
import { MovimentacaoService } from '../../services/movimentacao.service';
import { ParcelaService } from '../../services/parcela.service';
import { TipoPagamentoService } from '../../services/tipo-pagamento.service';
import { DiaFiscalComponent } from '../dia-fiscal/dia-fiscal.component';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    InputTextareaModule,
    InputSwitchModule,
    CalendarModule,
    DropdownModule,
    DialogModule,
    DiaFiscalComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  movimentacaoService: MovimentacaoService = inject(MovimentacaoService);
  categoriaService: CategoriaService = inject(CategoriaService);
  tiposPagamentoService: TipoPagamentoService = inject(TipoPagamentoService);
  parcelaService: ParcelaService = inject(ParcelaService);
  
  dias: DiaFiscal [] = [];

  selectedCategorias: number[] = [];
  selectedTiposPagamento: number[] = [];

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

  dataDeFiltragem = new Date()

  newMovimentacao: PostMovimentacao = { descricao: '', data: '', categoriaId: 0, fixa: false, tipoPagamentoId: 0 };
  newCategoria: PostCategoria = { nome: '', entrada: false };
  
  constructor() {}

  showDialogMovimentacao() {
    this.visibleModalMovimentacao = true;
  }

  showDialogCategoria() {
    this.visibleModalCategoria = true;
  }

  ngOnInit() {
    this.getMovimentacoes();
    
    this.getCategorias();
    this.getTiposPagamento();
  }

  OnCreateMovimentacaoSubmit() {
    if (this.newMovimentacao.valor === 0) {
      alert('Por favor, insira um valor maior que zero.');
      return;
    }

    if(this.movimentacaoParcelada && this.numeroParcelas >= 2) {
      const parcela: postParcela = {
        valorTotal: this.newMovimentacao.valor!,
        numeroParcelas: this.numeroParcelas,
        valorParcela: this.valorParcela,
        descricao: this.newMovimentacao.descricao!,
        dataInicio: this.newMovimentacao.data,
        categoriaId: this.newMovimentacao.categoriaId,
        tipoPagamentoId: this.newMovimentacao.tipoPagamentoId
    };
      
      this.parcelaService.postParcela(parcela).subscribe(parcela => {
        this.getMovimentacoes();
        this.newMovimentacao = { descricao: '', data: '', categoriaId: 0, fixa: false, tipoPagamentoId: 0 };
        this.numeroParcelas= 2;
        this.valorParcela = 0;
        this.labelValor = 'Valor:';
        this.movimentacaoParcelada = false;
        this.visibleModalMovimentacao = false;
      });
    } else {

      this.movimentacaoService.postMovimentacao(this.newMovimentacao).pipe(
        map((response: Movimentacao) => ({
          id: response.id,
          valor: response.valor,
          data: response.data,
          descricao: response.descricao,
          categoria: response.categoria
        }) as Movimentacao)
      ).subscribe(movimentacao => {
        this.getMovimentacoes();
        this.newMovimentacao = { descricao: '', data: '', categoriaId: 0, fixa: false, tipoPagamentoId: 0 };
        this.numeroParcelas= 2;
        this.valorParcela = 0;
        this.labelValor = 'Valor:';
        this.movimentacaoParcelada = false;
        this.visibleModalMovimentacao = false;
      });
    }
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

  getMovimentacoes() {
    this.movimentacaoService.getMovimentacoes(this.dataDeFiltragem.getMonth()+1, this.dataDeFiltragem.getFullYear(), this.entradaMovimentacaoFiltro, this.selectedCategorias, this.selectedTiposPagamento).subscribe(response => {
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

  parceladaOnChange() {
    this.labelValor = this.movimentacaoParcelada ? 'Valor total da compra:' : 'Valor:';
  }

  fixaOnChange() {
    if(this.movimentacaoParcelada) {
      this.movimentacaoParcelada = !this.newMovimentacao.fixa;
      this.numeroParcelas = 2;
      this.valorParcela = 0;
    }
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

    this.getMovimentacoes();
  }
}
