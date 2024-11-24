export interface Gasto {
    id?: number,
    valor?: number,
    data: string,
    descricao: string,
    categoriaId: number
}

export interface Categoria {
    id?: number,
    nome?: string
}