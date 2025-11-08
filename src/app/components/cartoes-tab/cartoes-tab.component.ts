import { Component, inject } from '@angular/core'
import { CartaoComponent } from '../cartao/cartao.component'
import { CommonModule } from '@angular/common'
import { CartaoModalComponent } from '../cartao-modal/cartao-modal.component'
import { Cartao, PostPutCartao } from '../../lib/types'
import { CartaoService } from '../../services/cartao.service'

@Component({
  selector: 'app-cartoes-tab',
  standalone: true,
  imports: [CommonModule, CartaoComponent, CartaoModalComponent],
  templateUrl: './cartoes-tab.component.html',
  styleUrl: './cartoes-tab.component.css',
})
export class CartoesTabComponent {
  cartaoService: CartaoService = inject(CartaoService)

  cartoes: Cartao[] = []
  cartao: PostPutCartao = { apelido: '', diaFechamento: 0 }
  cartaoId: number = 0
  visibleModalCartao: boolean = false

  ngOnInit() {
    this.getCartoes()
  }

  getCartoes() {
    this.cartaoService.getCartoes().subscribe({
      next: (cartoes) => {
        this.cartoes = cartoes
      },
    })
  }

  onCreateCartaoModal() {
    this.cartaoId = 0
    this.showDialogCartao()
  }

  showDialogCartao() {
    this.visibleModalCartao = false
    setTimeout(() => {
      this.visibleModalCartao = true
    }, 0)
  }

  onEditCartao(idCartao: number) {
    this.cartaoId = idCartao
    this.showDialogCartao()
  }
}
