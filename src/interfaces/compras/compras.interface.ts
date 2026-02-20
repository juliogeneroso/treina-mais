import type { PacoteResponse } from "./pacote/pacote.interface"

export interface ConcursoRequest {
  nome: string
  descricao: string
  dataProva: string
}

export interface ConcursoResponse {
  id: number
  nome: string
  descricao: string
  dataProva: string
  pacotes?: PacoteResponse[]
}
