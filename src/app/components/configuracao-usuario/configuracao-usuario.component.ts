import { CommonModule } from '@angular/common'
import { Component} from '@angular/core'
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
import { CategoriasTabComponent } from '../categorias-tab/categorias-tab.component'
import { ResponsaveisTabComponent } from "../responsaveis-tab/responsaveis-tab.component";
import { CartoesTabComponent } from "../cartoes-tab/cartoes-tab.component";
import { VisualizacaoTabComponent } from "../visualizacao-tab/visualizacao-tab.component";

@Component({
    selector: 'app-configuracao-usuario',
    standalone: true,
    imports: [
    CommonModule,
    LucideAngularModule,
    CategoriasTabComponent,
    ResponsaveisTabComponent,
    CartoesTabComponent,
    VisualizacaoTabComponent
],
    templateUrl: './configuracao-usuario.component.html',
    styleUrl: './configuracao-usuario.component.css',
})
export class ConfiguracaoUsuarioComponent {
    readonly SquareUserRoundIcon = SquareUserRoundIcon
    readonly FileIcon = FileIcon
    readonly ChevronRightIcon = ChevronRightIcon
    readonly ChevronDownIcon = ChevronDownIcon
    readonly BookMarkedIcon = BookMarkedIcon
    readonly BookUserIcon = BookUserIcon
    readonly WalletCardsIcon = WalletCardsIcon
    readonly LayoutListIcon = LayoutListIcon

    isPerfilCollapsed = true
    isVisualizacaoCollapsed = true
    isCategoriasCollapsed = true
    isResponsaveisCollapsed = true
    isCartoesCollapsed = true
    
    activeTab: string = 'categorias'

    setActiveTab(tab: string) {
        this.activeTab = tab
    }
}
