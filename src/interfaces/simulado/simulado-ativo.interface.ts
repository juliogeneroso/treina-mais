export interface SimuladoAtivoResponse {
    id: number;
    titulo: string;
    dataCriacao: string;
    tempoDuracao: number;
    quantidadeQuestoes: number;
    nivelDificuldade: string;
    banca: string;
    status: string;
    questoes: Questao[];
}

export interface Questao {
    id: number;
    enunciado: string;
    alternativaA: string;
    alternativaB: string;
    alternativaC: string;
    alternativaD: string;
    tema: string;
    capitulo: string;
    subCapitulo: string;
}   
