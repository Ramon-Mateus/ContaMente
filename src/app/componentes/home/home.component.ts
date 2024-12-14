import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Categoria, Gasto, PostGasto } from '../../lib/types';
import { CategoriaService } from '../../services/categoria.service';
import { GastoService } from '../../services/gasto.service';
import { GastoComponent } from '../gasto/gasto.component';
import { DialogModule } from 'primeng/dialog';
import { map } from 'rxjs';

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
  styleUrl: './home.component.css'
})
export class HomeComponent {
  gastoService: GastoService = inject(GastoService);
  categoriaService: CategoriaService = inject(CategoriaService);
  
  gastos: Gasto[] = [];
  categorias: Categoria[] = [];
  visible: boolean = false;

  newGasto: PostGasto = {descricao: '', data: '', categoriaId: 0 };
  
  constructor() {}

  showDialog() {
    this.visible = true;
  }

  ngOnInit() {
    this.gastoService.getGastos().subscribe(gastos => {
      this.gastos = gastos;
    });

    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    })
  }

  OnCreateGastoSubmit() {
    this.gastoService.postGasto(this.newGasto).pipe(
      map((response: Gasto) => ({
        id: response.id,
        valor: response.valor,
        data: response.data,
        descricao: response.descricao,
        categoria: response.categoria
      }) as Gasto)
    ).subscribe(gasto => {
      this.gastos.push(gasto);
      this.newGasto = { descricao: '', data: '', categoriaId: 0 };
    });
  }

  onDeleteGasto(id: number) {
    this.gastoService.deleteGasto(id).subscribe(() => {
      this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    });
  }
}
