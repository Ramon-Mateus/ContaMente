import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { Categoria, Movimentacao, PostMovimentacao, postParcela, TipoPagamento } from '../../lib/types';
import { ParcelaService } from '../../services/parcela.service';
import { MovimentacaoService } from '../../services/movimentacao.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-movimentacao-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    InputTextareaModule,
    InputSwitchModule,
    CalendarModule,
    DropdownModule,
    DialogModule
  ],
  templateUrl: './movimentacao-modal.component.html',
  styleUrl: './movimentacao-modal.component.css'
})
export class MovimentacaoModalComponent implements OnChanges {
  categoriaService: CategoriaService = inject(CategoriaService);
  parcelaService: ParcelaService = inject(ParcelaService);
  movimentacaoService: MovimentacaoService = inject(MovimentacaoService);
  
  @Input() visible: boolean = false;
  @Input() movimentacao: PostMovimentacao = { descricao: '', data: new Date(), categoriaId: 0, fixa: false, tipoPagamentoId: 0 };
  @Input() categorias: Categoria[] = [];
  @Input() tiposPagamento: TipoPagamento[] = [];
  @Input() labelValor: string = 'Valor';
  @Input() numeroParcelas: number = 2;
  @Input() valorParcela: number = 0;
  @Input() idMovimentacao: number = 0;

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<PostMovimentacao>();

  entradaCategoria: boolean = false;
  movimentacaoParcelada: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue === true && this.idMovimentacao > 0) {
      this.movimentacaoService.getMovimentacaoById(this.idMovimentacao).subscribe(movimentacao => {
        this.movimentacao = {
          valor: movimentacao.valor,
          descricao: movimentacao.descricao,
          data: new Date(movimentacao.data),
          categoriaId: movimentacao.categoria.id!,
          fixa: movimentacao.fixa,
          tipoPagamentoId: movimentacao.tipoPagamento.id!
        };
      });
    } else {
      this.movimentacao = { descricao: '', data: new Date(), categoriaId: 0, fixa: false, tipoPagamentoId: 0 };
    }
  }

  getCategorias() {
    this.categoriaService.getCategorias(this.entradaCategoria).subscribe(categorias => {
      this.categorias = categorias;
    });
  }	

  fixaOnChange() {
    if(this.movimentacaoParcelada) {
      this.movimentacaoParcelada = !this.movimentacao.fixa;
      this.numeroParcelas = 2;
      this.valorParcela = 0;
    }
  }

  parceladaOnChange() {
    this.labelValor = this.movimentacaoParcelada ? 'Valor total da compra:' : 'Valor:';
  }

  onSubmit() {
    if (this.movimentacao.valor === 0) {
      alert('Por favor, insira um valor maior que zero.');
      return;
    }

    this.submit.emit(this.movimentacao);
  }

  OnCreateMovimentacaoSubmit() {
    if (this.movimentacao.valor === 0) {
      alert('Por favor, insira um valor maior que zero.');
      return;
    }

    if(this.idMovimentacao === 0) {
      if(this.movimentacaoParcelada && this.numeroParcelas >= 2) {
        const parcela: postParcela = {
          valorTotal: this.movimentacao.valor!,
          numeroParcelas: this.numeroParcelas,
          valorParcela: this.valorParcela,
          descricao: this.movimentacao.descricao!,
          dataInicio: this.movimentacao.data.toString(),
          categoriaId: this.movimentacao.categoriaId,
          tipoPagamentoId: this.movimentacao.tipoPagamentoId
      };
        this.parcelaService.postParcela(parcela).subscribe(parcela => {
          this.submit.emit();
          this.movimentacao = { descricao: '', data: '', categoriaId: 0, fixa: false, tipoPagamentoId: 0 };
          this.numeroParcelas= 2;
          this.valorParcela = 0;
          this.labelValor = 'Valor:';
          this.movimentacaoParcelada = false;
          this.visible = false;
        });
      } else {
        this.movimentacaoService.postMovimentacao(this.movimentacao).pipe(
          map((response: Movimentacao) => ({
            id: response.id,
            valor: response.valor,
            data: response.data,
            descricao: response.descricao,
            categoria: response.categoria
          }) as Movimentacao)
        ).subscribe(movimentacao => {
          this.submit.emit();
          this.movimentacao = { descricao: '', data: new Date(), categoriaId: 0, fixa: false, tipoPagamentoId: 0 };
          this.numeroParcelas= 2;
          this.valorParcela = 0;
          this.labelValor = 'Valor:';
          this.movimentacaoParcelada = false;
          this.visible = false;
        });
      }
    } else {
      this.movimentacaoService.putMovimentacao(this.idMovimentacao, this.movimentacao).pipe(
        map((response: Movimentacao) => ({
          id: response.id,
          valor: response.valor,
          data: response.data,
          descricao: response.descricao,
          categoria: response.categoria
        }) as Movimentacao)
      ).subscribe(movimentacao => {
        this.submit.emit();
        this.movimentacao = { descricao: '', data: new Date(), categoriaId: 0, fixa: false, tipoPagamentoId: 0 };
        this.numeroParcelas= 2;
        this.valorParcela = 0;
        this.labelValor = 'Valor:';
        this.movimentacaoParcelada = false;
        this.visible = false;
      });
    }
  }
}
