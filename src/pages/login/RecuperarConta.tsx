import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Stack,
  InputAdornment,
  Link,
  CssBaseline,
  IconButton
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useColorMode } from '../../theme';
import { useApi } from '../../services/useAPI';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/image-paginal-inicial.png';


interface tokenResponse {
  token: string;
}

const RecuperarConta = () => {
  const { mode, toggleColorMode } = useColorMode();
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [token, setAccessToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [codigoValidado, setCodigoValidado] = useState(false);
  const [aguardandoCodigo, setAguardandoCodigo] = useState(false);
  const { request: sendRecoveryEmail, isLoading } = useApi();
  const { request: validateCode, isLoading: isLoadingValidateCode } = useApi();
  const { request: sendNewPassword, isLoading: isLoadingNewPassword } = useApi();

  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const enviarLinkRecuperacao = async () => {
    try {
      await sendRecoveryEmail('/auth/solicitar', {
        method: 'POST',
        body: { email },
      });
      setAguardandoCodigo(true);
      enqueueSnackbar('Se o e-mail estiver cadastrado, um link de recuperação foi enviado.', {
        variant: 'info',
      });
    } catch {
      enqueueSnackbar('Ocorreu um erro ao enviar o link de recuperação. Tente novamente mais tarde.', {
        variant: 'error',
      });
    }
  };

  const validarCodigo = () => {
    validateCode('/auth/confirmar-codigo', {
      method: 'POST',
      body: { email, codigo },
    }).then((data) => {
      const d = data as tokenResponse;
      setAccessToken(d.token);
      setCodigoValidado(true);
      enqueueSnackbar('Código validado! Você pode agora criar uma nova senha.', {
        variant: 'success',
      });
    }).catch(() => {
      enqueueSnackbar('Ocorreu um erro ao validar o código. Tente novamente mais tarde.', {
        variant: 'error',
      });
    });
  };

  const salvarNovaSenha = () => {
    if (!novaSenha.trim()) {
      enqueueSnackbar('Informe a nova senha.', {
        variant: 'warning',
      });
      return;
    }
    sendNewPassword('/auth/redefinir', {
      method: 'POST',
      body: { token, novaSenha },
    }).then(() => {
      enqueueSnackbar('Senha redefinida com sucesso, realize o login novamente.', {
        variant: 'success',
      });
      navigate('/login');
    }).catch(() => {
      enqueueSnackbar('Ocorreu um erro ao redefinir a senha. Tente novamente mais tarde.', {
        variant: 'error',
      });
    });
  };

  return (
    <>
      <CssBaseline />
      <Grid 
        container 
        sx={{ 
          minHeight: '100vh', 
          width: '100vw', 
          m: 0, 
          p: 0,
          overflowX: 'hidden' 
        }}
      >
        <Grid
          size={{ xs: 0, md: 6 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            p: 6,
          }}
        >
          <Box sx={{ maxWidth: 450, textAlign: 'center' }}>
            <Typography variant="h2" fontWeight="900" gutterBottom>
              RECUPERAR
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Não se preocupe, vamos te ajudar a voltar aos estudos.
            </Typography>
            <Box
              component="img"
              src={image}
              sx={{ 
                width: '100%', 
                maxHeight: 400, 
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))' 
              }}
            />
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            p: { xs: 3, md: 8 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <IconButton color="inherit" onClick={toggleColorMode}>
                {mode === 'dark' ? (
                  <LightModeIcon fontSize="small" />
                ) : (
                  <DarkModeIcon fontSize="small" />
                )}
              </IconButton>
            </Box>
            <Link 
              href="/login" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 4, 
                color: 'text.secondary', 
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                '&:hover': { color: '#3b82f6' }
              }}
            >
              <ArrowBackRoundedIcon fontSize="small" /> Voltar para o Login
            </Link>

            <Typography variant="h4" fontWeight="900" color="text.primary" gutterBottom>
              Esqueceu a senha?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
              Insira o e-mail associado à sua conta e enviaremos um link para redefinir sua senha.
            </Typography>

            <Stack spacing={4}>
              <Box>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>
                  E-mail cadastrado
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={handleEmailChange} 
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailRoundedIcon fontSize="small" color="disabled" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3, bgcolor: 'action.hover' }
                    }
                  }}
                />
              </Box>

              {aguardandoCodigo && (
                <Box>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>
                    Código de confirmação
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Digite o código recebido"
                    value={codigo}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCodigo(event.target.value)}
                    slotProps={{
                      input: {
                        sx: { borderRadius: 3, bgcolor: 'action.hover' }
                      }
                    }}
                  />
                </Box>
              )}

              {codigoValidado && (
                <Box>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>
                    Nova senha
                  </Typography>
                  <TextField
                    fullWidth
                    type="password"
                    variant="outlined"
                    placeholder="Digite a nova senha"
                    value={novaSenha}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNovaSenha(event.target.value)}
                    slotProps={{
                      input: {
                        sx: { borderRadius: 3, bgcolor: 'action.hover' }
                      }
                    }}
                  />
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  py: 1.8,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  bgcolor: '#3b82f6',
                  boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)',
                  '&:hover': { bgcolor: '#2563eb' }
                }}
                loading={codigoValidado ? isLoadingNewPassword : (aguardandoCodigo ? isLoadingValidateCode : isLoading)}
                onClick={codigoValidado ? salvarNovaSenha : (aguardandoCodigo ? validarCodigo : enviarLinkRecuperacao)}
              >
                {codigoValidado
                  ? 'Salvar nova senha'
                  : aguardandoCodigo
                  ? 'Validar Código'
                  : 'Enviar link de recuperação'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Ainda tem dúvidas?
                  <br />
                  <Link href="mailto:treinamaisapp@gmail.com" underline="hover" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
                   treinamaisapp@gmail.com
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default RecuperarConta;