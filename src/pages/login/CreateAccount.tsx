import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Stack,
  InputAdornment,
  IconButton
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useColorMode } from '../../theme';
import image from '../../assets/image-paginal-inicial.png';
import { useApi } from '../../services/useAPI';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';


const CreateAccount = () => {

  const { mode, toggleColorMode } = useColorMode();
  const [showPassword, setShowPassword] = React.useState(false);
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState(''); 
  const [errorEmail, setErrorEmail] = React.useState('');
  const [errorSenha, setErrorSenha] = React.useState('');
  const [errorNome, setErrorNome] = React.useState('');
  const { request, isLoading } = useApi();

  const navigate = useNavigate();

  const handleNomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value);
  } 
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  } 
  const handleSenhaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(event.target.value);
  }

  const createAccount = () => {

    if(!nome){
      setErrorNome('O nome é obrigatório');
    }
    
    const isEmailValid = email.includes('@');
    const isSenhaValid = senha.length >= 8;

    setErrorEmail(isEmailValid ? '' : 'E-mail inválido');
    setErrorSenha(isSenhaValid ? '' : 'A senha deve conter pelo menos 8 caracteres');

    if (!isEmailValid || !isSenhaValid || !nome) {
      return;
    }

    request('/api/usuario/create',{
      method: 'POST',
      body: {
        nome: nome, email: email, senha: senha
    }}).then(() => {
      // useApi só entra aqui se o HTTP status for 2xx (incluindo 200)
      enqueueSnackbar('Conta criada com sucesso! Faça login para acessar sua conta.', { variant: 'success' });
      navigate('/login');
    }).catch((err: any) => {
      console.error('Erro ao criar conta:', err);
      enqueueSnackbar('Ocorreu um erro ao criar a conta. Tente novamente mais tarde.', { variant: 'error' });
    });
  }

  return (
    <Grid container sx={{ minHeight: '100vh', width: '100vw', padding:0, margin: 0 }}>
      <Grid
        size={{ xs: 0, md: 6 }}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }}
      >
        <Box sx={{ maxWidth: 450, textAlign: 'center' }}>
          <Typography variant="h2" fontWeight="900" gutterBottom>
            CRIAR CONTA
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Acesse sua jornada de estudos
          </Typography>
          
          <Box
            component="img"
            src={image}
            sx={{ width: '100%', maxHeight: 400, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))' }}
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
          <Typography variant="h4" fontWeight="900" color="text.primary" textAlign="center" gutterBottom>
            Criar Conta
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 5 }}>
            Bem-vindo! Por favor, insira seus dados para criar uma conta.
          </Typography>

          <Stack spacing={3}>
             <Box>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>
                Usuário
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={nome}
                onChange={handleNomeChange}
                error={!!errorNome} 
                helperText={errorNome}
                placeholder="Seu usuário"
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

            <Box>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>
                E-mail
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                error={!!errorEmail} 
                helperText={errorEmail}
                placeholder="exemplo@email.com"
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

            <Box>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>
                Senha
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={senha}
                onChange={handleSenhaChange}
                error={!!errorSenha}
                helperText={errorSenha}
                placeholder="Sua senha"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon fontSize="small" color="disabled" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: 'action.hover' }
                  }
                }}
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              loading={isLoading}
              onClick={() => createAccount()}
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
            >
              Criar Conta
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
              sx={{ mt: 1, textTransform: 'none', fontWeight: 'bold' }}
            >
              Voltar para o login
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CreateAccount;