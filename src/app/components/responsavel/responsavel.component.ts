import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostPutResponsavel, Responsavel } from '../../lib/types';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ResponsavelService } from '../../services/responsavel.service';
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

@Component({
  selector: 'app-responsavel',
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
  templateUrl: './responsavel.component.html',
  styleUrl: './responsavel.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ResponsavelComponent {
  @Input() responsavel!: Responsavel;
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
        message: 'Todas as movimentações associadas a esse responsável também serão excluídas! Tem certeza que deseja excluir esse responsável?',
        accept: () => {
            this.onDelete();
            this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Responsável excluído com sucesso', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejeitado', detail: 'Responsável não excluído', life: 3000 });
        }
    });
  }

  onDelete() {
    this.responsavelService.deleteResponsavel(this.responsavel.id!).subscribe({
      next: () => {
        this.Delete.emit(true);
      }
    })
  }

  onEdit() {
    this.Edit.emit(this.responsavel.id);
  }
}
