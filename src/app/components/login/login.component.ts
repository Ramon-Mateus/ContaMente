import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';

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

  message: string = "";
  submitted: boolean = false;


  constructor(private authService: AutenticacaoService, private router: Router) { }

  login() {
    if (this.submitted) return;
    if (this.email == "" || this.password == "") {
      this.setMessage("Credenciais vazias.")
      return
    }

    this.submitted = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe(
      () => {
        this.trataSucesso()
        this.submitted = false;
      },
      (errorResponse) => {
        this.trataErro(errorResponse);
        this.submitted = false;
      }
    );
  }

  trataSucesso() {
    this.authService.setAutenticado(true);
    this.router.navigate(['/']);


  }

  trataErro(errorResponse: any) {
    if (errorResponse.status == 401) 
      this.setMessage("Credenciais inválidas!")
    else 
      this.setMessage("Erro no servidor.")
  }

  setMessage(message: string) {
    this.message = message
    setTimeout(() => {
      this.message = ""
    }, 5000);
  }
}
