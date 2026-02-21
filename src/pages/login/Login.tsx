import React from 'react';
import {
  Box,
  Typography,
   Grid,
  Button,
  TextField,
  Stack,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useApi } from '../../services/useAPI';
import type { HttpError } from '../../interfaces/error/http-error.interface';
import type { AuthResponse } from '../../interfaces/user/response-user.interface';

// import GoogleIcon from '@mui/icons-material/Google';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import AppleIcon from '@mui/icons-material/Apple';

const Login = () => {

  const [showPassword, setShowPassword] = React.useState(false);  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');   
  const [errorEmail, setErrorEmail] = React.useState('');
  const [errorPassword, setErrorPassword] = React.useState('');
  const { request, isLoading, error } = useApi();


  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {      
    setPassword(event.target.value);
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  const validatePassword = (password: string) => {
    return password.length >= 6;
  } 

  const login = () => {
    // Lógica de autenticação aqui
    validateEmail(email) ? setErrorEmail('') : setErrorEmail('E-mail inválido');
    validatePassword(password) ? setErrorPassword('') : setErrorPassword ('A senha deve conter pelo menos 6 caracteres');

    request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: ({ email: email , senha: password }),
      withAuth: false
    }).then((data) => {

      const authData = data as AuthResponse;
      const { token, refreshToken, usuario } = authData;

      token && localStorage.setItem('accessToken', token);
      refreshToken && localStorage.setItem('refreshToken', refreshToken);
      usuario && localStorage.setItem('user', JSON.stringify(usuario));

      window.location.href = '/dashboard';
    }).catch((err: HttpError) => { 
      console.error('Login failed:', err.message);
      setErrorPassword('Falha ao autenticar. Verifique suas credenciais.');
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
          bgcolor: '#3b82f6',
         
          color: 'white'
        }}
      >
        <Box sx={{ maxWidth: 450, textAlign: 'center' }}>
          <Typography variant="h2" fontWeight="900" gutterBottom>
            LOGIN
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Acesse sua jornada de estudos
          </Typography>
          
          <Box
            component="img"
            src="https://illustrations.popsy.co/white/studying.svg"
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
          bgcolor: 'white',
          p: { xs: 3, md: 8 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" fontWeight="900" color="#0f172a" textAlign="center" gutterBottom>
            ENTRAR
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 5 }}>
            Bem-vindo de volta! Por favor, insira seus dados.
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="caption" fontWeight="bold" sx={{ ml: 1, mb: 0.5, display: 'block', color: '#64748b' }}>
                E-mail ou Usuário
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
                        <EmailRoundedIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: '#f8fafc' }
                  }
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight="bold" sx={{ ml: 1, mb: 0.5, display: 'block', color: '#64748b' }}>
                Senha
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
                error={!!errorPassword}
                helperText={errorPassword}
                placeholder="Sua senha"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: '#f8fafc' }
                  }
                }}
              />
            </Box>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <FormControlLabel 
                control={<Checkbox size="small" />} 
                label={<Typography variant="caption" sx={{ color: '#64748b' }}>Lembrar de mim</Typography>} 
              />
              <Link href="/recuperacao" underline="hover" sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#3b82f6' }}>
                Esqueceu a senha?
              </Link>
            </Stack>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => login()}
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
              Entrar
            </Button>

            <Typography variant="body2" textAlign="center" sx={{ color: '#64748b' }}>
              Não tem uma conta?{' '}
              <Link href="#" underline="hover" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
                Inscreva-se
              </Link>
            </Typography>

            {/* <Divider sx={{ my: 2, color: '#cbd5e1', fontSize: '0.75rem' }}>LOGAR COM</Divider>

            <Stack direction="row" spacing={2} justifyContent="center">
              <IconButton sx={{ border: '1px solid #e2e8f0', p: 1.5 }}><FacebookIcon sx={{ color: '#1877F2' }} /></IconButton>
              <IconButton sx={{ border: '1px solid #e2e8f0', p: 1.5 }}><GoogleIcon /></IconButton>
              <IconButton sx={{ border: '1px solid #e2e8f0', p: 1.5 }}><AppleIcon sx={{ color: 'black' }} /></IconButton>
            </Stack> */}
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;