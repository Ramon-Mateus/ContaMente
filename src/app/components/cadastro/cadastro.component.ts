import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    PasswordModule,
    CommonModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private authService: AutenticacaoService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  registro() {
    if (this.isPasswordStrong(this.password)) {
      this.authService.registrar({ name: this.name, email: this.email, password: this.password }).subscribe(() => {
        this.router.navigate(['/login']);
      });
    } else {
      this.toastr.error('A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número, um símbolo e ter no mínimo 8 caracteres', 'Erro de Validação');
    }
  }

  isPasswordStrong(password: string): boolean {
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    return pattern.test(password);
  }
}