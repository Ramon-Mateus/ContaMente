import { Component } from '@angular/core';
import { Gasto } from '../../lib/types';
import { ApiService } from '../../services/api.service';
import { GastoComponent } from '../gasto/gasto.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    GastoComponent, CommonModule, FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  gastos: Gasto[] = [];
  newGasto: Gasto = { valor: 0, descricao: '', data: '', categoriaId: 0 };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getGastos().subscribe(gastos => {
      this.gastos = gastos;
    });
  }

  OnCreateGastoSubmit() {
    this.apiService.postGasto(this.newGasto).subscribe(gasto => {
      this.gastos.push(gasto);
      this.newGasto = { valor: 0, descricao: '', data: '', categoriaId: 0 };
    });
  }

  onDeleteGasto(id: number) {
    this.apiService.deleteGasto(id).subscribe(() => {
      this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    });
  }
}
