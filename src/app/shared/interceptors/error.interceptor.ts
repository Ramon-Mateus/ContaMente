import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, throwError } from 'rxjs'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router'

export interface ApiErrorResponse {
  status: number
  mensagem: string
  detalhe: string
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService)
  const router = inject(Router)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro inesperado'
      let errorTitle = 'Erro'

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erro: ${error.error.message}`
      } else {
        const apiError = error.error as ApiErrorResponse

        if (apiError?.mensagem) {
          errorMessage = apiError.detalhe
          errorTitle = getErrorTitle(error.status)

          if (apiError.detalhe) {
            console.error('Detalhes:', apiError.detalhe)
          }
        } else {
          errorMessage = getDefaultErrorMessage(error.status)
          errorTitle = getErrorTitle(error.status)
        }

        // Redirecionamentos automáticos
        if (error.status === 401) {
          setTimeout(() => router.navigate(['/login']), 1000)
        }
      }

      if (error.status !== 401) {
        // Mostrar toast
        toastr.error(errorMessage, errorTitle, {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
        })
      }

      return throwError(() => error)
    })
  )
}

function getErrorTitle(status: number): string {
  switch (status) {
    case 400:
      return 'Requisição Inválida'
    case 403:
      return 'Acesso Negado'
    case 404:
      return 'Não Encontrado'
    case 500:
      return 'Erro do Servidor'
    default:
      return 'Erro'
  }
}

function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Dados inválidos fornecidos.'
    case 403:
      return 'Você não tem permissão.'
    case 404:
      return 'Recurso não encontrado.'
    case 500:
      return 'Erro interno do servidor.'
    case 0:
      return 'Não foi possível conectar com o servidor.'
    default:
      return `Erro ${status}: Algo deu errado.`
  }
}
