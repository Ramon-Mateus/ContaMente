import { Component } from '@angular/core';
import { Gasto } from '../../lib/types';
import { ApiService } from '../../services/api.service';
import { GastoComponent } from '../gasto/gasto.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    GastoComponent, CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private apiService: ApiService) {}

  gastos: Gasto[] = [];


  ngOnInit() {
    this.apiService.getGastos().subscribe(gastos => {
      this.gastos = gastos;
    });
  }

}
