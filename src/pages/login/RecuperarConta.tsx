import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Stack,
  InputAdornment,
  Link,
  CssBaseline
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

const RecuperarConta = () => {
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
              src="https://illustrations.popsy.co/white/thinking.svg" 
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
              >
                Enviar link de recuperação
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Ainda tem dúvidas?{' '}
                  <Link href="#" underline="hover" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
                    Contatar suporte
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