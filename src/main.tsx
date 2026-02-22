import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import './index.css'
import App from './App.tsx'
import { store } from './store'
import { AppThemeProvider } from './theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppThemeProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <App />
        </SnackbarProvider>
      </AppThemeProvider>
    </Provider>
  </StrictMode>,
)