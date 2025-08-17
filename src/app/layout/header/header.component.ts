import { Component } from '@angular/core';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Usuario } from '../../lib/types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    RouterLink,

    MenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  items: MenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => this.perfil()
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];
  usuarioLogado: Usuario = { id: '', name: '', email: '' };

  constructor(public authService: AutenticacaoService, private router: Router) {}

  ngOnInit() {
    this.authService.atualizarHeader.subscribe(() => {
      this.getUsuarioLogado();
    });

    this.getUsuarioLogado();
  }

  login() {
    this.router.navigate(['/login']);
  }

  cadastro() {
    this.router.navigate(['/cadastro']);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  minhasMovimentacoes() {
    this.router.navigate(['movimentacoes'])
  }
  
  perfil() {
    this.router.navigate(['/configuracao-usuario']);
  }

  getUsuarioLogado() {
    this.authService.getUser().subscribe({
      next: (usuario) => {
        this.usuarioLogado = usuario;
      }
    });
  }
}
