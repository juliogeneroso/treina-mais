import type { NivelDificuldade, QuestaoResponse } from "../questao/questao.interface"

export interface CriarSimuladoRequest {
  concursoId: number
  subcapituloIds: number[]
  bancas: string[]
  niveis: NivelDificuldade[]
  quantidadeQuestoes: number
  tempoDuracao: number
}

export type StatusSimulado = "EM_ANDAMENTO" | "FINALIZADO"

export interface SimuladoResponse {
  id: number
  status: StatusSimulado
  quantidadeQuestoes: number
  tempoDuracao: number
  questoes: QuestaoResponse[]
}