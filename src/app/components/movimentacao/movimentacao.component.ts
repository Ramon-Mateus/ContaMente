import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { Movimentacao } from '../../lib/types';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-movimentacao',
  standalone: true,
  imports: [
        CommonModule,
        CardModule,
        ConfirmPopupModule,
        ToastModule,
        ButtonModule
  ],
  templateUrl: './movimentacao.component.html',
  styleUrl: './movimentacao.component.css',
  providers: [ConfirmationService, MessageService]
})
export class MovimentacaoComponent {
  @Input() movimentacao!: Movimentacao;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Deseja excluir?',
        accept: () => {
            this.onDelete();
            this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Registro excluído com sucesso', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejeitado', detail: 'Registro não excluído', life: 3000 });
        }
    });
  }

  onDelete() {
    this.delete.emit(this.movimentacao.id);
  }

  onEdit() {
    this.edit.emit(this.movimentacao.id);
  }
}
