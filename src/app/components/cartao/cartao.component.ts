import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Cartao } from '../../lib/types'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { DialogModule } from 'primeng/dialog'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { SidebarModule } from 'primeng/sidebar'
import { ToastModule } from 'primeng/toast'
import { CartaoService } from '../../services/cartao.service'
import { MenuModule } from 'primeng/menu'

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
    InputTextareaModule,
    MenuModule,
  ],
  templateUrl: './cartao.component.html',
  styleUrl: './cartao.component.css',
  providers: [ConfirmationService, MessageService],
})
export class CartaoComponent {
  @Input() cartao!: Cartao
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
    private CartaoService: CartaoService
  ) {}

  onDelete() {
    this.CartaoService.deleteCartao(this.cartao.id!).subscribe({
      next: () => {
        this.Delete.emit(true)
      },
    })
  }

  onEdit() {
    this.Edit.emit(this.cartao.id)
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
