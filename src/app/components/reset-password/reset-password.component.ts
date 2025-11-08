import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AutenticacaoService } from '../../services/autenticacao.service'

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup
  errorMessage: string = ''
  email: string = ''
  token: string = ''

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AutenticacaoService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordsMatch }
    )
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email']
      this.token = params['token']
      if (!this.email || !this.token) {
        this.router.navigate(['/movimentacoes'])
      }
    })
  }

  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    if (
      group.get('newPassword')?.value !== group.get('confirmPassword')?.value
    ) {
      return { mismatch: true }
    }
    return null
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) return

    const { newPassword } = this.resetPasswordForm.value

    this.authService
      .resetPassword({ email: this.email, token: this.token, newPassword })
      .subscribe({
        next: () => {
          this.router.navigate(['/login'])
        },
        error: () => {
          this.errorMessage = 'Erro ao redefinir a senha. Tente novamente.'
        },
      })
  }
}
