import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    PasswordModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  email: string = '';
  password: string = '';

  send() {
    
  }
}
