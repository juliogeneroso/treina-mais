export interface SubcapituloRequest {
  nome: string
  capituloId: number
}

export interface SubcapituloResponse {
  id: number
  nome: string
  capituloNome: string
  temaNome: string
}