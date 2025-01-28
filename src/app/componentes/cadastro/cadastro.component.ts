import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AutenticacaoService, private router: Router) {}

  registro() {
    this.authService.registrar({ email: this.email, password: this.password }).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
