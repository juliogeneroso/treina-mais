export type TipoCupom = "PERCENTUAL" | "VALOR_FIXO"

export interface CupomPreviewRequest {
  pacoteId: number
  codigo: string
}

export interface CupomPreviewResponse {
  valido: boolean
  mensagem: string
  precoOriginal: number
  desconto: number
  precoFinal: number
}

export interface CriarCupomRequest {
  codigo: string
  tipo: TipoCupom
  valor: number
  ativo: boolean
  inicioVigencia: string
  fimVigencia: string
  limiteUsosTotal: number
  limiteUsosPorUsuario: number
  valorMinimoCompra: number
}