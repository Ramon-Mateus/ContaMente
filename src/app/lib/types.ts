export interface Movimentacao {
    id?: number,
    valor: number,
    data: string,
    descricao: string,
    fixa: boolean,
    numeroParcela: number | null,
    categoria: Categoria,
    tipoPagamento: TipoPagamento,
    recorrencia: Recorrencia | null,
    parcela: Parcela | null
}

export interface PostMovimentacao {
    valor?: number,
    data: string,
    descricao?: string,
    fixa: boolean,
    categoriaId: number,
    tipoPagamentoId: number
}

export interface TipoPagamento {
    id: number,
    nome: string,
    movimentacoes: Movimentacao[]
}

export interface Recorrencia {
    id: number,
    dataInicio: string,
    dataFim: string
}

export interface Parcela {
    id: number,
    valorTotal: number,
    numeroParcelas: number,
    valorParcela: number,
    DataInicio: string,
    DataFim: string | null
}

export interface Categoria {
    id?: number,
    nome?: string
    entrada?: boolean
}

export interface PostCategoria {
    nome: string,
    entrada: boolean
}

export interface Usuario {
    id: number;
    username: string;
    email: string;
}

export interface Usuario_login {
    email: string;
    password: string;
}

export interface resetPasswordForm {
    email: string;
    token: string;
    newPassword: string;
};