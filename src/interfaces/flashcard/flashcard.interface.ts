export interface FlashcardsDashboardResponse {
  pendentesHoje: number
  metaDiariaPercentual: number
  baralhos: {
    id: number
    titulo: string
    temaNome: string
    pendentesHoje: number
    totalCartoes: number
  }[]
}

export interface CartaoRequest {
  frente: string
  verso: string
  temaId: number
  baralhoId: number
}

export interface CartaoResponse {
  id: number
  frente: string
  verso: string
  precisaRevisar: boolean
}

export interface FlashcardEstudoResponse {
  cartaoId: number | null
  frente: string | null
  verso: string | null
  pendentesHoje: number
  revisadosHoje: number
  metaDiariaPercentual: number
}