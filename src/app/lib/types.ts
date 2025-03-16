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

export interface DiaFiscal {
    data: Date;
    movimentacoes: Movimentacao[]
}

export interface PostMovimentacao {
    valor?: number,
    data: string | Date,
    descricao?: string,
    fixa: boolean,
    categoriaId: number,
    tipoPagamentoId: number
}

export interface TipoPagamento {
    id: number,
    nome: string,
    selected?: boolean,
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
    dataInicio: string,
    DataFim: string | null,
    movimentacoes: Movimentacao[]
}

export interface Categoria {
    id?: number,
    nome?: string
    entrada?: boolean
    selected?: boolean
}

export interface PostCategoria {
    nome: string,
    entrada: boolean
}

export interface postParcela {
    valorTotal: number,
    numeroParcelas: number,
    valorParcela: number,
    descricao: string,
    dataInicio: string,
    categoriaId: number,
    tipoPagamentoId: number
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