import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { AutenticacaoService } from '../../services/autenticacao.service'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, InputTextModule, PasswordModule, CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent {
  name: string = ''
  email: string = ''
  password: string = ''

  message: string = ''
  submitted: boolean = false

  constructor(
    private authService: AutenticacaoService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  registro() {
    if (!this.isPasswordStrong(this.password)) {
      this.toastr.error(
        'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número, um símbolo e ter no mínimo 8 caracteres',
        'Erro de Validação'
      )
      return
    }

    this.submitted = true

    this.authService
      .registrar({
        name: this.name,
        email: this.email,
        password: this.password,
      })
      .subscribe(
        () => {
          this.trataSucesso()
          this.submitted = false
        },
        (errorResponse) => {
          this.trataErro(errorResponse)
          this.submitted = false
        }
      )
  }

  trataSucesso() {
    this.router.navigate(['/login'])
  }

  trataErro(errorResponse: Response) {
    this.setMessage('Ocorreu um erro.')
  }

  isPasswordStrong(password: string): boolean {
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/
    return pattern.test(password)
  }

  setMessage(message: string) {
    this.message = message
    setTimeout(() => (this.message = ''), 5000)
  }
}
