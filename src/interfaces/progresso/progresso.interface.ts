export interface EvolucaoDiaria {
  data: string
  percentual: number
}

export interface DesempenhoMateria {
  materia: string
  percentual: number
}

export interface DesempenhoUsuarioDetalhadoResponse {
  nome: string
  nivel: number
  xpTotal: number
  tituloNivel: string
  questoesResolvidas: number
  taxaAcerto: number
  tempoEstudo: string
  diasAtivos: number
  evolucao: EvolucaoDiaria[]
  porMateria: DesempenhoMateria[]
}


export interface DesempenhoUsuarioResponse {
  questoesResolvidas: number
  aproveitamento: number
  tempoEstudo: string
}