export interface Movimentacao {
    id?: number,
    valor: number,
    data: string,
    descricao: string,
    fixa: boolean,
    numeroParcela: number | null,
    categoria: Categoria,
    tipoPagamento: TipoPagamento,
    responsavel: Responsavel | null,
    recorrencia: Recorrencia | null,
    parcela: Parcela | null,
    cartao: Cartao | null
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
    tipoPagamentoId: number,
    responsavelId: number | null,
    cartaoId: number | null
}

export interface TipoPagamento {
    id: number,
    nome: string,
    selected?: boolean
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

export interface PutCategoria {
    nome?: string,
    entrada?: boolean
}

export interface postParcela {
    valorTotal: number,
    numeroParcelas: number,
    valorParcela: number,
    descricao: string,
    dataInicio: string,
    categoriaId: number,
    tipoPagamentoId: number
    responsavelId: number | null
}

export interface Usuario {
    id: string;
    name: string;
    email: string;
}

export interface Usuario_login {
    email: string;
    password: string;
}

export interface Usuario_registro {
    name: string;
    email: string;
    password: string;
}

export interface resetPasswordForm {
    email: string;
    token: string;
    newPassword: string;
};

export interface Responsavel {
    id: number,
    nome: string,
    userId: string,
    user: Usuario | null,
    movimentacoes: Movimentacao[],
    selected?: boolean
}

export interface PostPutResponsavel {
    nome: string
}

export interface Cartao {
    id: number,
    apelido: string,
    diaFechamento: number,
    selected?: boolean
}

export interface PostPutCartao {
    apelido: string,
    diaFechamento: number
}

export interface UserConfiguration {
    listagemPorFatura: boolean
}