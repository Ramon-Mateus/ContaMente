import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Gasto } from '../../lib/types';
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  gastos: Gasto[] = [];
  newGasto: Gasto = {descricao: '', data: '', categoriaId: 0 };
  gastoService: GastoService = inject(GastoService);

  constructor() {}

  ngOnInit() {
    this.gastoService.getGastos().subscribe(gastos => {
      this.gastos = gastos;
    });
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
