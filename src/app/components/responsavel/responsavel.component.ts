import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Responsavel } from '../../lib/types'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api'
import { ResponsavelService } from '../../services/responsavel.service'
import { CommonModule } from '@angular/common'
import { CardModule } from 'primeng/card'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { ToastModule } from 'primeng/toast'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { SidebarModule } from 'primeng/sidebar'
import { FormsModule } from '@angular/forms'
import { InputSwitchModule } from 'primeng/inputswitch'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { MenuModule } from 'primeng/menu'

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
    InputTextareaModule,
    MenuModule,
  ],
  templateUrl: './responsavel.component.html',
  styleUrl: './responsavel.component.css',
  providers: [ConfirmationService, MessageService],
})
export class ResponsavelComponent {
  @Input() responsavel!: Responsavel
  @Output() Delete = new EventEmitter<boolean>()
  @Output() Edit = new EventEmitter<number>()

  visibleDeleteModal: boolean = false
  items: MenuItem[] = [
    {
      label: 'Editar',
      command: () => {
        this.onEdit()
      },
    },
    {
      label: 'Deletar',
      command: (event) => {
        this.deleteModalToggle()
      },
    },
  ]

  constructor(
    private messageService: MessageService,
    private responsavelService: ResponsavelService
  ) {}

  onDelete() {
    this.responsavelService.deleteResponsavel(this.responsavel.id!).subscribe({
      next: () => {
        this.Delete.emit(true)
      },
    })
  }

  onEdit() {
    this.Edit.emit(this.responsavel.id)
  }

  onDeleteRejection() {
    this.visibleDeleteModal = false

    this.messageService.add({
      severity: 'error',
      summary: 'Rejeitado',
      detail: 'Registro não excluído',
      life: 3000,
    })
  }

  onDeleteConfirmation() {
    this.messageService.add({
      severity: 'info',
      summary: 'Confirmado',
      detail: 'Registro excluído com sucesso',
      life: 3000,
    })
    this.onDelete()
  }

  deleteModalToggle() {
    this.visibleDeleteModal = !this.visibleDeleteModal
  }
}
