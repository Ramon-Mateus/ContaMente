import { Routes } from '@angular/router';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LandingComponent } from './components/landing/landing.component';
import { ConfiguracaoUsuarioComponent } from './components/configuracao-usuario/configuracao-usuario.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingComponent,
    },
    {
        path: 'movimentacoes',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'configuracao-usuario',
        component: ConfiguracaoUsuarioComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'cadastro',
        component: CadastroComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'resetPassword',
        component: ResetPasswordComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'landing',
        component: LandingComponent
    }
];
