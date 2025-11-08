import { Component } from '@angular/core'
import { AutenticacaoService } from '../../services/autenticacao.service'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  email: string = ''
  message: string = ''

  constructor(private authService: AutenticacaoService) {}

  forgotPassword() {
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.message =
          'Verifique sua caixa de entrada para redefinir sua senha.'
      },
      error: () => {
        this.message =
          'Certifique-se de que o email está correto e tente novamente.'
      },
    })
  }
}
