export interface Gasto {
    id?: number,
    valor?: number,
    data: string,
    descricao: string,
    categoria: Categoria
}

export interface PostGasto {
    valor?: number,
    data: string,
    descricao?: string,
    categoriaId: number
}

export interface Categoria {
    id?: number,
    nome?: string
}

export interface PostCategoria {
    nome: string
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
