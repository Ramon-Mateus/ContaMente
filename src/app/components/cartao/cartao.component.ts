import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cartao } from '../../lib/types';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ResponsavelService } from '../../services/responsavel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-cartao',
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
    InputTextareaModule
  ],
  templateUrl: './cartao.component.html',
  styleUrl: './cartao.component.css',
  providers: [ConfirmationService, MessageService]
})
export class CartaoComponent {
  @Input() cartao!: Cartao;
  @Output() Delete = new EventEmitter<boolean>();
  @Output() Edit = new EventEmitter<number>();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private responsavelService: ResponsavelService
  ) {}
 
  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Todas as movimentações associadas a esse cartão também serão excluídas! Tem certeza que deseja excluir esse cartão?',
      accept: () => {
        this.onDelete();
        this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Cartão excluído com sucesso', life: 3000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeitado', detail: 'Cartão não excluído', life: 3000 });
      }
    });
  }

  onDelete() {
    this.responsavelService.deleteResponsavel(this.cartao.id!).subscribe({
      next: () => {
        this.Delete.emit(true);
      }
    })
  }

  onEdit() {
    this.Edit.emit(this.cartao.id);
  }
}
