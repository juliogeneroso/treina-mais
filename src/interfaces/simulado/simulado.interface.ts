export interface FiltroSimuladoResponse {
  concursoId: number
  temas: {
    id: number
    nome: string
    capitulos: {
      id: number
      nome: string
      subcapitulos: {
        id: number
        nome: string
      }[]
    }[]
  }[]
  bancasDisponiveis: string[]
  niveisDisponiveis: string[]
}