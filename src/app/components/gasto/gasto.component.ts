import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Gasto } from '../../lib/types';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-gasto',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ConfirmPopupModule,
    ToastModule,
    ButtonModule
  ],
  templateUrl: './gasto.component.html',
  styleUrl: './gasto.component.css',
  providers: [ConfirmationService, MessageService]
})
export class GastoComponent {
  @Input() gasto!: Gasto;
  @Output() delete = new EventEmitter<number>();

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  confirm(event: Event) {
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
    this.delete.emit(this.gasto.id);
  }
}
