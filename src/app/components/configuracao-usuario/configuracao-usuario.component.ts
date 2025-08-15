import { Component, inject, OnInit } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria, PostPutResponsavel, Responsavel, Usuario } from '../../lib/types';
import { CommonModule } from '@angular/common';
import { CategoriaComponent } from '../categoria/categoria.component';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Router } from '@angular/router';
import { ResponsavelService } from '../../services/responsavel.service';
import { ResponsavelComponent } from '../responsavel/responsavel.component';
import { ResponsavelModalComponent } from "../responsavel-modal/responsavel-modal.component";

@Component({
  selector: 'app-configuracao-usuario',
  standalone: true,
  imports: [
    CommonModule,
    CategoriaComponent,
    ResponsavelComponent,
    ResponsavelModalComponent
],
  templateUrl: './configuracao-usuario.component.html',
  styleUrl: './configuracao-usuario.component.css'
})
export class ConfiguracaoUsuarioComponent implements OnInit {
  categoriaService: CategoriaService = inject(CategoriaService);
  autenticacaoService: AutenticacaoService = inject(AutenticacaoService);
  responsavelService: ResponsavelService = inject(ResponsavelService);

  router: Router = inject(Router);

  categoriasSaida: Categoria[] = [];
  categoriasEntrada: Categoria[] = [];
  usuarioLogado: Usuario = { id: '', name: '', email: '' };
  responsaveis: Responsavel[] = [];
  visibleModalResponsavel: boolean = false;
  responsavel: PostPutResponsavel = { nome: "" };
  responsavelId: number = 0;

  ngOnInit() {
    this.getCategorias();
    this.getResponsaveis();
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

  getResponsaveis() {
    this.responsavelService.getResponsaveis().subscribe({
      next: (responsaveis) => {
        this.responsaveis = responsaveis;
        console.log("Responsaveis: ", this.responsaveis);
        console.log("Tamanho de responsaveis: ", this.responsaveis.length);
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
    this.autenticacaoService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  onCreateResponsavelModal() {
    this.responsavelId = 0;
    this.showDialogResponsavel();
  }

  showDialogResponsavel() {
    this.visibleModalResponsavel = false;
    setTimeout(() => {
      this.visibleModalResponsavel = true;
    }, 0);
  }

  onEditResponsavel(idResponsavel: number) {
    this.responsavelId = idResponsavel;
    this.showDialogResponsavel();
  }
}
