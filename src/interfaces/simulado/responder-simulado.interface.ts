export interface RespostaSimuladoRequest {
  respostas: {
    questaoId: number
    respostaUsuario: "A" | "B" | "C" | "D"
  }[]
}

export interface ResultadoSimuladoResponse {
  totalQuestoes: number
  totalAcertos: number
  pontuacaoFinal: number
}

export interface ResultadoDetalhadoResponse {
  questoes: {
    questaoId: number
    respostaUsuario: string
    respostaCorreta: string
    correta: boolean
  }[]
  pontuacaoFinal: number
}

export interface SimuladoFinalizadoResponse {
  simuladoId: number
  pontuacaoFinal: number
  totalQuestoes: number
  totalAcertos: number
  totalErros: number
  feedbackQuestoes: {
    questaoId: number
    enunciado: string
    respostaCorreta: string
    respostaUsuario: string
    correta: boolean
    explicacao: string
  }[]
}