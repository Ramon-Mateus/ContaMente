import { Component, inject } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria, Usuario } from '../../lib/types';
import { CommonModule } from '@angular/common';
import { CategoriaComponent } from '../categoria/categoria.component';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-configuracao-usuario',
  standalone: true,
  imports: [
    CommonModule,
    CategoriaComponent,
    RouterModule
  ],
  templateUrl: './configuracao-usuario.component.html',
  styleUrl: './configuracao-usuario.component.css'
})
export class ConfiguracaoUsuarioComponent {
  categoriaService: CategoriaService = inject(CategoriaService);
  autenticacaoService: AutenticacaoService = inject(AutenticacaoService);

  categoriasSaida: Categoria[] = [];
  categoriasEntrada: Categoria[] = [];
  usuarioLogado: Usuario = { id: '', name: '', email: '' };

  ngOnInit() {
    this.getCategorias();
    this.getUsuarioLogado();
  }

  getCategorias() {
    this.categoriaService.getCategorias(false).subscribe({
      next: (categorias) => {
        this.categoriasSaida = categorias;
      }
    });

    this.categoriaService.getCategorias(true).subscribe({
      next: (categorias) => {
        this.categoriasEntrada = categorias;
      }
    });
  }

  getUsuarioLogado() {
    this.autenticacaoService.getUser().subscribe({
      next: (usuario) => {
        this.usuarioLogado = usuario;
      }
    });
  }

  logout() {
    this.autenticacaoService.logout();
  }
}
