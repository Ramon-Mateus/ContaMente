import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { MovimentacaoComponent } from "../movimentacao/movimentacao.component";

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
    MovimentacaoComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  movimentacaoService: MovimentacaoService = inject(MovimentacaoService);
  categoriaService: CategoriaService = inject(CategoriaService);
  tiposPagamentoService: TipoPagamentoService = inject(TipoPagamentoService);
  parcelaService: ParcelaService = inject(ParcelaService);
  
  movimentacoes: Movimentacao[] = [];
  dias: DiaFiscal [] = [];

  categorias: Categoria[] = [];
  categoriasSaidaFiltro: Categoria[] = [];
  categoiriasEntradaFiltro: Categoria[] = [];
  tiposPagamento: TipoPagamento[] = [];
  totalMovimentacoes: number = 0;
  visibleModalMovimentacao: boolean = false;
  visibleModalCategoria: boolean = false;
  entradaCategoria: boolean = false;
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
      this.movimentacoes = this.movimentacoes.filter(movimentacao => movimentacao.id !== id);
    });
  }

  getMovimentacoes() {
    this.movimentacaoService.getMovimentacoes(this.dataDeFiltragem.getMonth()+1, this.dataDeFiltragem.getFullYear()).subscribe(response => {
      this.movimentacoes = response.movimentacoes;
      this.totalMovimentacoes = response.total;
    });
  }

  getCategorias() {
    this.categoriaService.getCategorias(this.entradaCategoria).subscribe(categorias => {
      this.categorias = categorias;
    });

    this.categoriaService.getCategorias(false).subscribe(categorias => {
      this.categoriasSaidaFiltro = categorias;
    });

    this.categoriaService.getCategorias(true).subscribe(categorias => {
      this.categoiriasEntradaFiltro = categorias;
    });
  }

  getTiposPagamento() {
    this.tiposPagamentoService.getTiposPagamento().subscribe(tiposPagamento => {
      this.tiposPagamento = tiposPagamento;
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
}
