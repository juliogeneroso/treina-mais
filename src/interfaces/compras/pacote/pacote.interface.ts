
export interface PacoteRequest {
  nome: string
  descricao: string
  preco: number
  duracaoDias: number
  concursoId: number
  temaIds: number[]
}

export interface PacoteResponse {
  id: number
  nome: string
  descricao: string
  preco: number
  duracaoDias: number
  concursoNome: string
  temas: string[]
  versao: number
}