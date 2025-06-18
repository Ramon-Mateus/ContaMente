import { Component, Input, input } from '@angular/core';
import { Categoria, PutCategoria } from '../../lib/types';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ConfirmPopupModule,
    ToastModule,
    ButtonModule,
    DialogModule,
    SidebarModule,
    FormsModule,
    InputSwitchModule,
    InputTextareaModule
  ],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css',
  providers: [ConfirmationService, MessageService]
})
export class CategoriaComponent {
  @Input() categoria!: Categoria;

  editCategoria: PutCategoria = {};

  visibleModalCategoria: boolean = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService ,
    private categoriaService: CategoriaService
  ) {}
 
  confirmDelete(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Todas as movimentações associadas a essa categoria também serão excluídas! Tem certeza que deseja excluir essa categoria?',
        accept: () => {
            this.onDelete();
            this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Categoria excluída com sucesso', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejeitado', detail: 'Categoria não excluída', life: 3000 });
        }
    });
  }

  onDelete() {
    this.categoriaService.deleteCategoria(this.categoria.id!);
  }

  showDialogCategoria() {
    this.editCategoria = {
      nome: this.categoria.nome,
      entrada: this.categoria.entrada
    };
    this.visibleModalCategoria = true;
  }

  OnEditCategoria() {
    this.categoriaService.putCategoria(this.categoria.id!, {
      nome: this.editCategoria.nome,
      entrada: this.editCategoria.entrada
    } as PutCategoria).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria editada com sucesso' });
        this.visibleModalCategoria = false;
      }
    });
  }
}
