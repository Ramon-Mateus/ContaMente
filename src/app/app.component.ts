import { Component } from '@angular/core';
import { PainelDaSemanaComponent } from './componentes/painel-da-semana/painel-da-semana.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PainelDaSemanaComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ContaMente';
}
