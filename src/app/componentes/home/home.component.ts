import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { map } from 'rxjs';
import { Categoria, Gasto, PostGasto } from '../../lib/types';
import { CategoriaService } from '../../services/categoria.service';
import { GastoService } from '../../services/gasto.service';
import { GastoComponent } from '../gasto/gasto.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    GastoComponent,
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
  gastoService: GastoService = inject(GastoService);
  categoriaService: CategoriaService = inject(CategoriaService);
  
  gastos: Gasto[] = [];
  categorias: Categoria[] = [];
  totalGastos: number = 0;
  visible: boolean = false;

  dataDeFiltragem = new Date()

  newGasto: PostGasto = {descricao: '', data: '', categoriaId: 0 };
  
  constructor() {}

  showDialog() {
    this.visible = true;
  }

  ngOnInit() {
    this.getGastos();

    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    })
  }

  OnCreateGastoSubmit() {
    if (this.newGasto.valor === 0) {
      alert('Por favor, insira um valor maior que zero.');
      return;
    }

    this.gastoService.postGasto(this.newGasto).pipe(
      map((response: Gasto) => ({
        id: response.id,
        valor: response.valor,
        data: response.data,
        descricao: response.descricao,
        categoria: response.categoria
      }) as Gasto)
    ).subscribe(gasto => {
      this.getGastos();
      this.newGasto = { descricao: '', data: '', categoriaId: 0 };
      this.visible = false;
    });
  }

  onDeleteGasto(id: number) {
    this.gastoService.deleteGasto(id).subscribe(() => {
      this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    });
  }

  getGastos() {
    this.gastoService.getGastos(this.dataDeFiltragem.getMonth()+1, this.dataDeFiltragem.getFullYear()).subscribe(response => {
      this.gastos = response.gastos;
      this.totalGastos = response.total;
    });
  }
}
