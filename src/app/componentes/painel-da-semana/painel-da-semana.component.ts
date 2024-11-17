import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DiaComponent } from './dia/dia.component';

@Component({
  selector: 'app-painel-da-semana',
  standalone: true,
  imports: [
    CommonModule,
    DiaComponent
  ],
  templateUrl: './painel-da-semana.component.html',
  styleUrl: './painel-da-semana.component.css'
})
export class PainelDaSemanaComponent {
  dias: Object[] = new Array

  constructor(){
    this.dias.push({"xixs":"aaa"})
    this.dias.push({"xixs":"aaa"})
    this.dias.push({"xixs":"aaa"})
    this.dias.push({"xixs":"aaa"})
    this.dias.push({"xixs":"aaa"})
  }
}
