import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dia',
  standalone: true,
  imports: [],
  templateUrl: './dia.component.html',
  styleUrl: './dia.component.css'
})
export class DiaComponent {
  @Input({required:true}) nome!: string;

  constructor() {
  }
}
