import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Categoria, Gasto } from '../../lib/types';
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
    DropdownModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  gastoService: GastoService = inject(GastoService);
  categoriaService: CategoriaService = inject(CategoriaService);

  gastos: Gasto[] = [];
  categorias: Categoria[] = [];

  newGasto: Gasto = {descricao: '', data: '', categoriaId: 0 };
  

  constructor() {}

  ngOnInit() {
    this.gastoService.getGastos().subscribe(gastos => {
      this.gastos = gastos;
    });

    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    })
  }

  OnCreateGastoSubmit() {
    this.gastoService.postGasto(this.newGasto).subscribe(gasto => {
      this.gastos.push(gasto);
      this.newGasto = { valor: 0, descricao: '', data: '', categoriaId: 0 };
    });
  }

  onDeleteGasto(id: number) {
    this.gastoService.deleteGasto(id).subscribe(() => {
      this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    });
  }
}
