import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AutenticacaoService } from '../services/autenticacao.service'
import { catchError, map, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AutenticacaoService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.verificarSessao().pipe(
      map((autenticado) => {
        if (autenticado) {
          return true
        } else {
          this.router.navigate(['/login'])
          return false
        }
      }),
      catchError(() => {
        this.router.navigate(['/login'])
        return [false]
      })
    )
  }
}
