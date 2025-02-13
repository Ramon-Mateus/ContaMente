import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { map } from 'rxjs';
import { Categoria, Movimentacao, PostCategoria, PostMovimentacao } from '../../lib/types';
import { CategoriaService } from '../../services/categoria.service';
import { MovimentacaoService } from '../../services/movimentacao.service';
import { MovimentacaoComponent } from "../movimentacao/movimentacao.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MovimentacaoComponent,
    CommonModule,
    FormsModule,
    InputNumberModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule,
    DialogModule
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  movimentacaoService: MovimentacaoService = inject(MovimentacaoService);
  categoriaService: CategoriaService = inject(CategoriaService);
  
  movimentacoes: Movimentacao[] = [];
  categorias: Categoria[] = [];
  totalMovimentacoes: number = 0;
  visibleModalMovimentacao: boolean = false;
  visibleModalCategoria: boolean = false;

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
  }

  OnCreateMovimentacaoSubmit() {
    if (this.newMovimentacao.valor === 0) {
      alert('Por favor, insira um valor maior que zero.');
      return;
    }

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
      this.visibleModalMovimentacao = false;
    });
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
    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }
}
