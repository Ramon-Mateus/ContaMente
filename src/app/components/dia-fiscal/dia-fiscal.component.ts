import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dia-fiscal',
  standalone: true,
  imports: [],
  templateUrl: './dia-fiscal.component.html',
  styleUrl: './dia-fiscal.component.css'
})
export class DiaFiscalComponent {
  @Input() dia!: string;
}
