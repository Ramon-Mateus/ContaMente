import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ResponsavelService } from '../../services/responsavel.service';
import { PostPutResponsavel } from '../../lib/types';

@Component({
  selector: 'app-responsavel-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextareaModule
  ],
  templateUrl: './responsavel-modal.component.html',
  styleUrl: './responsavel-modal.component.css'
})
export class ResponsavelModalComponent {
  responsavelService: ResponsavelService = inject(ResponsavelService);

  @Input() visible: boolean = false;
  @Input() responsavel: PostPutResponsavel = { nome: "" };
  @Input() responsavelId: number = 0;

  @Output() submit = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue === true && this.responsavelId > 0) {
      this.responsavelService.getResponsavelById(this.responsavelId).subscribe(responsavel => {
        this.responsavel = responsavel;
      });
    } else {
      this.responsavel = { nome: "" };
    }
  }

  OnCreateResponsavelSubmit() {
    if(this.responsavelId === 0) {
      this.responsavelService.postResponsavel(this.responsavel).subscribe(() => {
        this.submit.emit();
        this.visible = false;
      });
    } else {
      this.responsavelService.putResponsavel(this.responsavelId, this.responsavel).subscribe(() => {
        this.submit.emit();
        this.visible = false;
      });
    }
  }
}
