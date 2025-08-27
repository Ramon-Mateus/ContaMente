import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { MenuModule } from 'primeng/menu'
import { ToastModule } from 'primeng/toast'
import { Movimentacao } from '../../lib/types'

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

    items: MenuItem[] = [
        {
            label: 'Editar',
            command: () => {
                this.onEdit()
            },
        },
        { label: 'Deletar', command: (event)=>{this.confirmDelete(event as Event)} },
    ]

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        if (this.movimentacao.parcela != null) {
            this.parcelaFormatada =
                this.movimentacao.numeroParcela!.toString().padStart(2, '0') +
                '/' +
                this.movimentacao.parcela
                    .numeroParcelas!.toString()
                    .padStart(2, '0')
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

    confirmDelete(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Deseja excluir?',
            accept: () => {
                this.onDelete()
                this.messageService.add({
                    severity: 'info',
                    summary: 'Confirmado',
                    detail: 'Registro excluído com sucesso',
                    life: 3000,
                })
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejeitado',
                    detail: 'Registro não excluído',
                    life: 3000,
                })
            },
        })
    }

    onDelete() {
        this.delete.emit(this.movimentacao.id)
    }

    onEdit() {
        this.edit.emit(this.movimentacao.id)
    }
}
