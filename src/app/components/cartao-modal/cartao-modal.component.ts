import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { CartaoService } from '../../services/cartao.service';
import { PostPutCartao } from '../../lib/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from "primeng/inputnumber";

@Component({
  selector: 'app-cartao-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextareaModule,
    InputNumberModule
],
  templateUrl: './cartao-modal.component.html',
  styleUrl: './cartao-modal.component.css'
})
export class CartaoModalComponent {
  cartaoService: CartaoService = inject(CartaoService);

  @Input() visible: boolean = false;
  @Input() cartao: PostPutCartao = { apelido: "", diaFechamento: 1 };
  @Input() cartaoId: number = 0;

  @Output() submit = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue === true && this.cartaoId > 0) {
      this.cartaoService.getCartaoById(this.cartaoId).subscribe(cartao => {
        this.cartao = cartao;
      });
    } else {
      this.cartao = { apelido: "", diaFechamento: 1 };
    }
  }

  OnCreateCartaoSubmit() {
    if(this.cartaoId === 0) {
      this.cartaoService.postCartao(this.cartao).subscribe(() => {
        this.submit.emit();
        this.visible = false;
      });
    } else {
      this.cartaoService.putCartao(this.cartaoId, this.cartao).subscribe(() => {
        this.submit.emit();
        this.visible = false;
      });
    }
  }
}
