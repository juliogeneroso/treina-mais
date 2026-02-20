export interface ConfiguracaoUsuarioRequest {
  receberNotificacoes: boolean;
  notificacoesPush: boolean;
  notificacoesEmail: boolean;
  modoDarkMode: boolean;
  idiomaPreferido: string;
}

export interface ConfiguracaoUsuarioResponse {
  receberNotificacoes: boolean;
  notificacoesPush: boolean;
  notificacoesEmail: boolean;
  modoDarkMode: boolean;
  idiomaPreferido: string;
}