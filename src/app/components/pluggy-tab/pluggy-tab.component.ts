import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { ToastrService } from 'ngx-toastr'
import { PluggyService } from '../../services/pluggy.service'
import { PluggyCredenciais } from '../../lib/types'

@Component({
  selector: 'app-pluggy-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, PasswordModule],
  templateUrl: './pluggy-tab.component.html',
})
export class PluggyTabComponent {
  private pluggyService = inject(PluggyService)
  private toastr = inject(ToastrService)

  credenciais: PluggyCredenciais = { configurado: false, clientId: null, atualizadoEm: null }
  clientId = ''
  clientSecret = ''
  editando = false
  salvando = false

  ngOnInit() {
    this.carregar()
  }

  carregar() {
    this.pluggyService.getCredenciais().subscribe((c) => {
      this.credenciais = c
      this.clientId = c.clientId ?? ''
      this.editando = !c.configurado
    })
  }

  salvar() {
    if (!this.clientId.trim() || !this.clientSecret.trim()) return
    this.salvando = true
    this.pluggyService.salvarCredenciais(this.clientId.trim(), this.clientSecret.trim()).subscribe({
      next: (c) => {
        this.credenciais = c
        this.clientSecret = ''
        this.editando = false
        this.salvando = false
        this.toastr.success('Credenciais do Pluggy salvas')
      },
      error: () => (this.salvando = false),
    })
  }

  cancelar() {
    this.clientId = this.credenciais.clientId ?? ''
    this.clientSecret = ''
    this.editando = false
  }

  remover() {
    if (!confirm('Remover as credenciais do Pluggy? A importação deixará de funcionar.')) return
    this.pluggyService.removerCredenciais().subscribe(() => {
      this.toastr.success('Credenciais removidas')
      this.carregar()
    })
  }
}
