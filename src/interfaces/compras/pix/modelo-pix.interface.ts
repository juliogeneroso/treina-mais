export interface CriarCompraPixResponse {
  compraId: number
  status: "PENDENTE" | "APROVADA" | "CANCELADA"
  qrCodeBase64: string | null
  qrCodeCopiaCola: string
  expiracaoPix: string
  ticketUrl?: string
}

export interface CompraResponse {
  id: number
  status: string
  ativo: boolean
  dataCompra: string
  dataExpiracao: string
}