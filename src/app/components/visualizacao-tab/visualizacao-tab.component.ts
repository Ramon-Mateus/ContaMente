import { Component, inject } from '@angular/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { UserConfigurationService } from '../../services/user-configuration.service';
import { UserConfiguration } from '../../lib/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visualizacao-tab',
  standalone: true,
  imports: [
    CommonModule,
    InputSwitchModule,
    FormsModule
  ],
  templateUrl: './visualizacao-tab.component.html',
  styleUrl: './visualizacao-tab.component.css'
})
export class VisualizacaoTabComponent {
  userConfigurationService: UserConfigurationService = inject(UserConfigurationService)
  
  userConfiguration: UserConfiguration = { listagemPorFatura: false }
  
  ngOnInit(){
    this.getUserConfiguration()
  }

  getUserConfiguration() {
    this.userConfigurationService.getUserConfiguration().subscribe({
      next: (config) => {
        this.userConfiguration = config
      },
    })
  }

  userConfigurationOnChange() {
    this.userConfigurationService
      .putUserConfiguration(this.userConfiguration)
      .subscribe()
  }
}
