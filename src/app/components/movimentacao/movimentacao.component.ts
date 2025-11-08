import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { MenuModule } from 'primeng/menu'
import { ToastModule } from 'primeng/toast'
import { Movimentacao } from '../../lib/types'
import { DialogModule } from 'primeng/dialog'

@Component({
  selector: 'app-movimentacao',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ConfirmPopupModule,
    ToastModule,
    ButtonModule,
    MenuModule,
    DialogModule,
  ],
  templateUrl: './movimentacao.component.html',
  styleUrl: './movimentacao.component.css',
  providers: [ConfirmationService, MessageService],
})
export class MovimentacaoComponent implements OnInit {
  @Input() movimentacao!: Movimentacao
  @Output() delete = new EventEmitter<number>()
  @Output() edit = new EventEmitter<number>()

  nomeResponsavel: string = ''
  parcelaFormatada: string = ''
  cartaoFormatado: string = ''

  deleteModalVisivel = false
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
        //this.confirmDelete(event as Event)
      },
    },
  ]

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.movimentacao.parcela != null) {
      this.parcelaFormatada =
        this.movimentacao.numeroParcela!.toString() +
        '/' +
        this.movimentacao.parcela.numeroParcelas!.toString()
    }

    if (this.movimentacao.cartao == null) {
      this.cartaoFormatado = ''
    } else {
      this.cartaoFormatado = '• ' + this.movimentacao.cartao.apelido
    }

    this.nomeResponsavel = this.movimentacao.responsavel
      ? '• ' + this.movimentacao.responsavel.nome.split(' ')[0]
      : '• Eu'
  }

  onDeleteRejection() {
    this.deleteModalVisivel = false

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

  onDelete() {
    this.delete.emit(this.movimentacao.id)
  }

  onEdit() {
    this.edit.emit(this.movimentacao.id)
  }

  normalizeString(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  deleteModalToggle() {
    this.deleteModalVisivel = !this.deleteModalVisivel
  }
}
