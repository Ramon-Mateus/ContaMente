import { Component } from '@angular/core';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
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

  constructor(public authService: AutenticacaoService, private router: Router) {}

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

  perfil() {
    this.router.navigate(['/configuracao-usuario']);
  }
}
