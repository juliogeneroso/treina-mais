export interface EvolucaoDiaria {
  data: string
  percentual: number
}

export interface DesempenhoMateria {
  materia: string
  percentual: number
}

export interface DesempenhoUsuarioResponse {
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