import { Component } from '@angular/core';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AutenticacaoService, private router: Router) { }

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe(() => {
      this.authService.setAutenticado(true);
      this.router.navigate(['/movimentacoes']);
    });
  }
}
