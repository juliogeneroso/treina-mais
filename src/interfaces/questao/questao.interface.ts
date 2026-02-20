export type NivelDificuldade = "FACIL" | "MEDIO" | "DIFICIL"

export interface QuestaoRequest {
  enunciado: string
  alternativaA: string
  alternativaB: string
  alternativaC: string
  alternativaD: string
  respostaCorreta: "A" | "B" | "C" | "D"
  nivelDificuldade: NivelDificuldade
  banca: string
  subcapituloId: number
  explicacao?: string
}

export interface QuestaoResponse {
  id: number
  enunciado: string
  alternativaA: string
  alternativaB: string
  alternativaC: string
  alternativaD: string
  respostaCorreta: string
  banca: string
  nivelDificuldade: NivelDificuldade
  subcapitulo: string
  capitulo: string
  tema: string
}