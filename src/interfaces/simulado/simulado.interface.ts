export interface FiltroSimuladoResponse {
  pacoteId: number,
  concursoId: number,
  nomePacote: string,
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
  }[],
  bancasDisponiveis: string[],
  niveisDisponiveis: string[],
}