import { Component, inject } from '@angular/core'
import { CategoriaService } from '../../services/categoria.service'
import { Categoria } from '../../lib/types'
import { CategoriaComponent } from '../categoria/categoria.component'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-categorias-tab',
  standalone: true,
  imports: [CommonModule, CategoriaComponent],
  templateUrl: './categorias-tab.component.html',
  styleUrl: './categorias-tab.component.css',
})
export class CategoriasTabComponent {
  categoriaService: CategoriaService = inject(CategoriaService)

  categoriasSaida: Categoria[] = []
  categoriasEntrada: Categoria[] = []

  ngOnInit() {
    this.getCategorias()
  }

  getCategorias() {
    this.categoriaService.getCategorias(false).subscribe({
      next: (categorias) => {
        this.categoriasSaida = categorias
      },
    })

    this.categoriaService.getCategorias(true).subscribe({
      next: (categorias) => {
        this.categoriasEntrada = categorias
      },
    })
  }
}
