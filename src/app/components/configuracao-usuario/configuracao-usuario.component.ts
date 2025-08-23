import { Component, inject, OnInit } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { Cartao, Categoria, PostPutCartao, PostPutResponsavel, Responsavel, Usuario } from '../../lib/types';
import { CommonModule } from '@angular/common';
import { CategoriaComponent } from '../categoria/categoria.component';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Router } from '@angular/router';
import { ResponsavelService } from '../../services/responsavel.service';
import { ResponsavelComponent } from '../responsavel/responsavel.component';
import { ResponsavelModalComponent } from "../responsavel-modal/responsavel-modal.component";
import { CartaoComponent } from '../cartao/cartao.component';
import { CartaoModalComponent } from '../cartao-modal/cartao-modal.component';
import { CartaoService } from '../../services/cartao.service';

@Component({
  selector: 'app-configuracao-usuario',
  standalone: true,
  imports: [
    CommonModule,
    CategoriaComponent,
    ResponsavelComponent,
    ResponsavelModalComponent,
    CartaoComponent,
    CartaoModalComponent
],
  templateUrl: './configuracao-usuario.component.html',
  styleUrl: './configuracao-usuario.component.css'
})
export class ConfiguracaoUsuarioComponent implements OnInit {
  categoriaService: CategoriaService = inject(CategoriaService);
  autenticacaoService: AutenticacaoService = inject(AutenticacaoService);
  responsavelService: ResponsavelService = inject(ResponsavelService);
  cartaoService: CartaoService = inject(CartaoService);

  router: Router = inject(Router);

  usuarioLogado: Usuario = { id: '', name: '', email: '' };
  
  categoriasSaida: Categoria[] = [];
  categoriasEntrada: Categoria[] = [];
  
  responsaveis: Responsavel[] = [];
  responsavel: PostPutResponsavel = { nome: "" };
  responsavelId: number = 0;
  visibleModalResponsavel: boolean = false;
  
  cartoes: Cartao[] = [];
  cartao: PostPutCartao = { apelido: "", diaFechamento: 0 };
  cartaoId: number = 0;
  visibleModalCartao: boolean = false;

  ngOnInit() {
    this.getCategorias();
    this.getResponsaveis();
    this.getCartoes();
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
      }
    });
  }

  getCartoes() {
    this.cartaoService.getCartoes().subscribe({
      next: (cartoes) => {
        this.cartoes = cartoes;
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

  onCreateCartaoModal() {
    this.cartaoId = 0;
    this.showDialogCartao();
  }

  showDialogCartao() {
    this.visibleModalCartao = false;
    setTimeout(() => {
      this.visibleModalCartao = true;
    }, 0);
  }

  onEditCartao(idCartao: number) {
    this.cartaoId = idCartao;
    this.showDialogCartao();
  }
}
