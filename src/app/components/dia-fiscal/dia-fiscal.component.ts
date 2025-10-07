import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiaFiscal } from '../../lib/types';
import { MovimentacaoComponent } from '../movimentacao/movimentacao.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dia-fiscal',
  standalone: true,
  imports: [
    CommonModule,
    MovimentacaoComponent
  ],
  templateUrl: './dia-fiscal.component.html',
  styleUrl: './dia-fiscal.component.css'
})
export class DiaFiscalComponent {
  @Input() dia!: DiaFiscal;
  @Input() ehUltimo!: boolean;
  @Output() deleteMovimentacao = new EventEmitter<number>();
  @Output() editMovimentacao = new EventEmitter<number>();

  onDeleteMovimentacao(id: number) {
    this.deleteMovimentacao.emit(id);
  }

  onEditMovimentacao(id: number) {
    this.editMovimentacao.emit(id);
  }
}
