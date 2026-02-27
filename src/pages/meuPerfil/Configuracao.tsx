import { useEffect, useState } from "react";
import { Avatar, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, Divider, TextField, IconButton, InputAdornment } from "@mui/material";
import type { RootState } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { AvatarSelector, avatarMap } from "./AvatarSelector";
import { useApi } from "../../services/useAPI";
import { enqueueSnackbar } from "notistack";
import { setUserAvatar } from "../../auth/authSlice";
import { PacotesAtivos } from "./PacotesAtivos";
import { useNavigate } from "react-router";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export interface PacoteAtivo {
  compraId: number;
  pacoteId: number;
  nomePacote: string;
  dataCompra: string;
  dataExpiracao: string;
  ativo: boolean;
  usuarioId: number;
  nomeUsuario: string;
  emailUsuario: string;
  concursoId: number;
  nomeConcurso: string;
  dataDaProva: string;
  diasRestantes: number;
}

export const Configuracao = () => {
  const { user } = useAppSelector(
    (state: RootState) => state.auth
  ) as unknown as { user?: { id?: string; avatarCodigo?: string; name?: string; email?: string } };
  const dispatch = useAppDispatch();

  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    user?.avatarCodigo || "avatar_01"
  );
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [pacotesAtivos, setPacotesAtivos] = useState<PacoteAtivo[]>([]);
  const [isLoadingPacotes, setIsLoadingPacotes] = useState(false);
  const [openSemPacotes, setOpenSemPacotes] = useState(false);
  const [openConfirmCancelar, setOpenConfirmCancelar] = useState(false);
  const [pacoteParaCancelar, setPacoteParaCancelar] = useState<PacoteAtivo | null>(null);
  const [isCancelandoPacote, setIsCancelandoPacote] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState<string>(user?.name || "");
  const [emailInstitucional, setEmailInstitucional] = useState<string>(user?.email || "");
  const [senhaAtual, setSenhaAtual] = useState<string>("");
  const [nomeErro, setNomeErro] = useState<string | null>(null);
  const [emailErro, setEmailErro] = useState<string | null>(null);
  const [senhaErro, setSenhaErro] = useState<string | null>(null);
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState<boolean>(false);
  const { request: atualizarImagemPerfil } = useApi();
  const { request: atualizarPerfil, isLoading: isLoadingAtualizarPerfil, refreshAccessToken } = useApi();
  const { request: pacotesAdquiridos } = useApi();
  const { request: cancelarCompra } = useApi();
  const navigate = useNavigate();

  const currentAvatarSrc = avatarMap[selectedAvatar];

  useEffect(() => {
    if (!user?.id) return;
    fetchPacotesAtivos();
},[]);

const fetchPacotesAtivos = () => {
  setIsLoadingPacotes(true);
    pacotesAdquiridos(`/api/pacotes/ativos`, {
      method: "GET",
      withAuth: true,
    })
      .then((data) => { 
        const d = data as PacoteAtivo[];
        setPacotesAtivos(d);
        if (!d || d.length === 0) {
          setOpenSemPacotes(true);
        }
    })
    .catch(() => {
    enqueueSnackbar("Erro ao carregar pacotes adquiridos.", {
        variant: "error",
    });
    })
    .finally(() => {
      setIsLoadingPacotes(false);
    });
  };

  const handleSalvarAlteracoes = () => {
    const nomeValido = nomeCompleto.trim().length > 0;
    const emailValido = emailInstitucional.trim().length > 0;
    const senhaValida = senhaAtual.trim().length > 0;

    let valido = true;

    if (!nomeValido) {
      setNomeErro("Informe seu nome completo.");
      valido = false;
    } else {
      setNomeErro(null);
    }

    if (!emailValido) {
      setEmailErro("Informe seu e-mail institucional.");
      valido = false;
    } else {
      setEmailErro(null);
    }

    if (!senhaValida) {
      setSenhaErro("Informe sua senha atual.");
      valido = false;
    } else {
      setSenhaErro(null);
    }

    if (!valido) return;

    atualizarPerfil(`/api/usuario/atualizar/perfil`, {
      method: "PUT",
      withAuth: true,
      body: {
        name: nomeCompleto,
        email: emailInstitucional,
        senhaAtual,
      },
    })
      .then(async () => {
       
          await refreshAccessToken()
          .then(() => {console.log("Token atualizado após alteração de perfil")})
          .catch(() => {
            console.log("Falha ao atualizar token após alteração de perfil")
            enqueueSnackbar("Perfil atualizado, mas houve um problema para atualizar sua sessão. Faça login novamente.", {
              variant: "warning",
            });
          });
      

        enqueueSnackbar("Perfil atualizado com sucesso.", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar('Não foi possível atualizar o perfil.', {
          variant: "error",
        });
      });
  };
   

  const mudarAvatar = (codigo: string) => {
    // Evita chamadas duplicadas enquanto já está atualizando
    if (isLoadingAvatar || codigo === selectedAvatar) return;

    setIsLoadingAvatar(true);
    atualizarImagemPerfil(`/api/usuario/${user?.id}/avatar`, {
      method: "PUT",
      withAuth: true,
      body: { avatarNome: codigo },
    })
      .then(() => {
        setSelectedAvatar(codigo);
        dispatch(setUserAvatar(codigo));
      })
      .catch(() => {
        enqueueSnackbar("Erro ao atualizar avatar. Tente novamente.", {
          variant: "error",
        });
      })
      .finally(() => {
        setIsLoadingAvatar(false);
      });
  }

  const onComprarMaisPacotes = () => {
    navigate('/pacotes');
  }

  const cancelarPacote = (pacote: PacoteAtivo) => {
    setPacoteParaCancelar(pacote);
    setOpenConfirmCancelar(true);
  };

  const handleFecharConfirmarCancelar = () => {
    setOpenConfirmCancelar(false);
    setPacoteParaCancelar(null);
  };

  const handleConfirmarCancelarPacote = () => {
    if (!pacoteParaCancelar) return;

    setIsCancelandoPacote(true);
    cancelarCompra(`/api/pacotes-comprados/${pacoteParaCancelar.compraId}/cancelar`, {
      method: "POST",
      withAuth: true,
    })
      .then(() => {
        setPacotesAtivos((prev) => prev.filter((p) => p.compraId !== pacoteParaCancelar.compraId));
        enqueueSnackbar("Pacote cancelado com sucesso.", {
          variant: "success",
        });
        handleFecharConfirmarCancelar();
        fetchPacotesAtivos(); // Recarrega os pacotes ativos para refletir a mudança
      })
      .catch(() => {
        enqueueSnackbar("Erro ao cancelar pacote. Tente novamente.", {
          variant: "error",
        });
      })
      .finally(() => {
        setIsCancelandoPacote(false);
      });
  };

  return (
    <Box p={{ xs: 2, md: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Configurações
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Aqui você pode configurar suas preferências e informações pessoais.
      </Typography>

      <Box
        mt={2}
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={4}
      >
        {/* Coluna esquerda: Escolha seu avatar */}
        <Box flex={1} minWidth={0}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Box
              sx={{
                position: "relative",
                width: 72,
                height: 72,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                src={currentAvatarSrc}
                sx={{ width: 72, height: 72, opacity: isLoadingAvatar ? 0.4 : 1 }}
              />
              {isLoadingAvatar && (
                <CircularProgress
                  size={32}
                  sx={{
                    position: "absolute",
                  }}
                />
              )}
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Avatar atual
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Clique em um dos avatares abaixo para alterar.
              </Typography>
            </Box>
          </Box>

          <AvatarSelector
            value={selectedAvatar}
            onChange={mudarAvatar}
          />
        </Box>

        {/* Coluna direita: Informações da conta */}
        <Box flex={1} minWidth={0}>
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Informações da conta
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              maxWidth={{ xs: "100%", md: "100%" }}
            >
              <TextField
                label="Nome Completo"
                fullWidth
                value={nomeCompleto}
                onChange={(e) => {
                  setNomeCompleto(e.target.value);
                  if (nomeErro) setNomeErro(null);
                }}
                error={!!nomeErro}
                helperText={nomeErro ?? ""}
              />
              <TextField
                label="E-mail Institucional"
                type="email"
                fullWidth
                value={emailInstitucional}
                onChange={(e) => {
                  setEmailInstitucional(e.target.value);
                  if (emailErro) setEmailErro(null);
                }}
                error={!!emailErro}
                helperText={emailErro ?? ""}
              />
              <TextField
                label="Senha Atual"
                fullWidth
                type={mostrarSenhaAtual ? "text" : "password"}
                value={senhaAtual}
                 error={!!senhaErro}
                helperText={senhaErro ?? ""}
                onChange={(e) => {
                  setSenhaAtual(e.target.value);
                  if (senhaErro) setSenhaErro(null);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setMostrarSenhaAtual((prev) => !prev)}
                        aria-label={mostrarSenhaAtual ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {mostrarSenhaAtual ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Button
                  variant="contained"
                  color="primary"
                  loading={isLoadingAtualizarPerfil}
                  onClick={handleSalvarAlteracoes}
                >
                  Salvar Alterações
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    <Divider sx={{ my: 4 }} />
      {isLoadingPacotes ? (
        <Box mt={4} display="flex" alignItems="center" justifyContent="center" gap={2}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary">
            Carregando seus pacotes ativos...
          </Typography>
        </Box>
      ) : (
        <PacotesAtivos pacotes={pacotesAtivos} onComprarMaisPacotes={onComprarMaisPacotes} onCancelarCompra={cancelarPacote}/>
      )}

      <Dialog open={openSemPacotes} onClose={() => setOpenSemPacotes(false)}>
        <DialogTitle>Nenhum pacote ativo encontrado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você ainda não possui pacotes ativos. Explore os pacotes disponíveis para começar a estudar com conteúdos completos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSemPacotes(false)} color="inherit">
            Agora não
          </Button>
          <Button onClick={() => { setOpenSemPacotes(false); onComprarMaisPacotes(); }} color="primary" variant="contained">
            Ver pacotes disponíveis
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmCancelar} onClose={handleFecharConfirmarCancelar}>
        <DialogTitle>Confirmar cancelamento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja cancelar o pacote
            {" "}
            <strong>{pacoteParaCancelar?.nomePacote}</strong>?
            {" "}
            Essa ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharConfirmarCancelar} color="inherit">
            Voltar
          </Button>
          <Button
            onClick={handleConfirmarCancelarPacote}
            color="error"
            variant="contained"
            disabled={isCancelandoPacote}
          >
            {isCancelandoPacote ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Cancelar pacote"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};  