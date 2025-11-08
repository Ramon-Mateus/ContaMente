import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core'
import { CategoriaService } from '../../services/categoria.service'
import { PostCategoria } from '../../lib/types'
import { InputSwitchModule } from 'primeng/inputswitch'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { DialogModule } from 'primeng/dialog'
import { InputTextModule } from 'primeng/inputtext'

@Component({
  selector: 'app-categoria-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputSwitchModule,
  ],
  templateUrl: './categoria-modal.component.html',
  styleUrl: './categoria-modal.component.css',
})
export class CategoriaModalComponent {
  categoriaService: CategoriaService = inject(CategoriaService)

  @Input() visible: boolean = false
  @Input() categoria: PostCategoria = { nome: '', entrada: false }
  @Input() categoriaId: number = 0

  @Output() submit = new EventEmitter<void>()

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['visible'] &&
      changes['visible'].currentValue === true &&
      this.categoriaId > 0
    ) {
      this.categoriaService
        .getCategoriaById(this.categoriaId)
        .subscribe((categoria) => {
          this.categoria = {
            nome: categoria.nome!,
            entrada: categoria.entrada!,
          }
        })
    } else {
      this.categoria = { nome: '', entrada: false }
    }
  }

  OnCreateCategoriaSubmit() {
    if (this.categoriaId === 0) {
      this.categoriaService.postCategoria(this.categoria).subscribe(() => {
        this.submit.emit()
        this.visible = false
      })
    } else {
      this.categoriaService
        .putCategoria(this.categoriaId, this.categoria)
        .subscribe(() => {
          this.submit.emit()
          this.visible = false
        })
    }
  }
}
