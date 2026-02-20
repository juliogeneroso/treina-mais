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