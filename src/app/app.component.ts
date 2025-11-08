import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { HeaderComponent } from './layout/header/header.component'
import { FooterComponent } from './layout/footer/footer.component'
import { AutenticacaoService } from './services/autenticacao.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private authService: AutenticacaoService) {}

  ngOnInit() {
    this.authService.verificarSessao().subscribe()
  }
}
