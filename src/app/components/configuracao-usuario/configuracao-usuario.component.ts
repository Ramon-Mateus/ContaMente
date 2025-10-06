import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import {
    BookMarkedIcon,
    BookUserIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    FileIcon,
    LayoutListIcon,
    LucideAngularModule,
    SquareUserRoundIcon,
    WalletCardsIcon,
} from 'lucide-angular'
import { InputSwitchModule } from 'primeng/inputswitch'
import {
    Cartao,
    PostPutCartao,
    PostPutResponsavel,
    Responsavel,
    UserConfiguration,
    Usuario,
} from '../../lib/types'
import { AutenticacaoService } from '../../services/autenticacao.service'
import { CartaoService } from '../../services/cartao.service'
import { ResponsavelService } from '../../services/responsavel.service'
import { UserConfigurationService } from '../../services/user-configuration.service'
import { CartaoModalComponent } from '../cartao-modal/cartao-modal.component'
import { CartaoComponent } from '../cartao/cartao.component'
import { ResponsavelModalComponent } from '../responsavel-modal/responsavel-modal.component'
import { ResponsavelComponent } from '../responsavel/responsavel.component'
import { CategoriasTabComponent } from '../categorias-tab/categorias-tab.component'
import { ResponsaveisTabComponent } from "../responsaveis-tab/responsaveis-tab.component";

@Component({
    selector: 'app-configuracao-usuario',
    standalone: true,
    imports: [
    CommonModule,
    ResponsavelComponent,
    ResponsavelModalComponent,
    CartaoComponent,
    CartaoModalComponent,
    InputSwitchModule,
    FormsModule,
    LucideAngularModule,
    CategoriasTabComponent,
    ResponsaveisTabComponent
],
    templateUrl: './configuracao-usuario.component.html',
    styleUrl: './configuracao-usuario.component.css',
})
export class ConfiguracaoUsuarioComponent implements OnInit {
    readonly SquareUserRoundIcon = SquareUserRoundIcon
    readonly FileIcon = FileIcon
    readonly ChevronRightIcon = ChevronRightIcon
    readonly ChevronDownIcon = ChevronDownIcon
    readonly BookMarkedIcon = BookMarkedIcon
    readonly BookUserIcon = BookUserIcon
    readonly WalletCardsIcon = WalletCardsIcon
    readonly LayoutListIcon = LayoutListIcon

    autenticacaoService: AutenticacaoService = inject(AutenticacaoService)
    responsavelService: ResponsavelService = inject(ResponsavelService)
    cartaoService: CartaoService = inject(CartaoService)
    userConfigurationService: UserConfigurationService = inject(UserConfigurationService)
    router: Router = inject(Router)

    isPerfilCollapsed = true
    isVisualizacaoCollapsed = true
    isCategoriasCollapsed = true
    isResponsaveisCollapsed = true
    isCartoesCollapsed = true

    usuarioLogado: Usuario = { id: '', name: '', email: '' }
    
    userConfiguration: UserConfiguration = { listagemPorFatura: false }
    
    cartoes: Cartao[] = []
    cartao: PostPutCartao = { apelido: '', diaFechamento: 0 }
    cartaoId: number = 0
    visibleModalCartao: boolean = false
    
    activeTab: string = 'categorias'

    ngOnInit() {
        this.getCartoes()
        this.getUsuarioLogado()
        this.getUserConfiguration()
    }

    getCartoes() {
        this.cartaoService.getCartoes().subscribe({
            next: (cartoes) => {
                this.cartoes = cartoes
            },
        })
    }

    getUserConfiguration() {
        this.userConfigurationService.getUserConfiguration().subscribe({
            next: (config) => {
                this.userConfiguration = config
            },
        })
    }

    getUsuarioLogado() {
        this.autenticacaoService.getUser().subscribe({
            next: (usuario) => {
                this.usuarioLogado = usuario
            },
        })
    }

    logout() {
        this.autenticacaoService.logout().subscribe(() => {
            this.router.navigate(['/login'])
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

    userConfigurationOnChange() {
        this.userConfigurationService
            .putUserConfiguration(this.userConfiguration)
            .subscribe()
    }

    setActiveTab(tab: string) {
        this.activeTab = tab
    }
}
