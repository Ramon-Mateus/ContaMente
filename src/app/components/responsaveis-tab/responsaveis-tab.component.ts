import { Component, inject } from '@angular/core';
import { ResponsavelComponent } from '../responsavel/responsavel.component';
import { PostPutResponsavel, Responsavel } from '../../lib/types';
import { ResponsavelService } from '../../services/responsavel.service';
import { CommonModule } from '@angular/common';
import { ResponsavelModalComponent } from '../responsavel-modal/responsavel-modal.component';

@Component({
  selector: 'app-responsaveis-tab',
  standalone: true,
  imports: [
    CommonModule,
    ResponsavelComponent,
    ResponsavelModalComponent
  ],
  templateUrl: './responsaveis-tab.component.html',
  styleUrl: './responsaveis-tab.component.css'
})
export class ResponsaveisTabComponent {

  responsavelService: ResponsavelService = inject(ResponsavelService)

  responsaveis: Responsavel[] = []
  responsavel: PostPutResponsavel = { nome: '' }
  responsavelId: number = 0
  visibleModalResponsavel: boolean = false


  ngOnInit(){
    this.getResponsaveis()
  }

    getResponsaveis() {
      this.responsavelService.getResponsaveis().subscribe({
          next: (responsaveis) => {
              this.responsaveis = responsaveis
          },
      })
    }

  onCreateResponsavelModal() {
    this.responsavelId = 0
    this.showDialogResponsavel()
  }

  onEditResponsavel(idResponsavel: number) {
    this.responsavelId = idResponsavel
    this.showDialogResponsavel()
  }

  showDialogResponsavel() {
    this.visibleModalResponsavel = false
    setTimeout(() => {
      this.visibleModalResponsavel = true
    }, 0)
  }
}
