import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Gasto } from '../../lib/types';

@Component({
  selector: 'app-gasto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gasto.component.html',
  styleUrl: './gasto.component.css'
})
export class GastoComponent {
  @Input() gasto!: Gasto;
  @Output() delete = new EventEmitter<number>();

  onDelete() {
    this.delete.emit(this.gasto.id);
  }
}
