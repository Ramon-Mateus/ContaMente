import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Gasto } from '../../lib/types';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-gasto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gasto.component.html',
  styleUrl: './gasto.component.css'
})
export class GastoComponent {
  
}
