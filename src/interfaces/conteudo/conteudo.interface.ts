export interface TemaRequest {
  nome: string
}

export interface TemaResponse {
  id: number
  nome: string
}

export interface TemaLoteRequest {
  temas: TemaRequest[]
}

export interface TemaEstruturaRequest {
  temas: {
    nome: string
    capitulos: {
      nome: string
      subcapitulos: string[]
    }[]
  }[]
}