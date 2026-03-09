import { BrowserRouter, Routes, Route } from "react-router-dom";
import PersistentDrawerLeft from "./components/header/Drawer";
import { Simulado } from "./pages/simulado/Simulado";
import { Resultado } from "./pages/simulado/resultado/Resultado";
import { FlashCard } from "./pages/flashcard/FlashCard";
import FlashcardEstudo from "./pages/flashcard/FlashcardEstudo";
import Dashboard from "./pages/dashboard/Dashboard";
import Desempenho from "./pages/desempenho/Desempenho";
import MonteSeuSimulado from "./pages/simulado/criacao/MonteSeuSimulado";
import Login from "./pages/login/Login";
import RecuperarConta from "./pages/login/RecuperarConta";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import NaoEncontrado from "./pages/redirecionamentos/NaoEncontrado";
import { Configuracao } from "./pages/meuPerfil/Configuracao";
import { Pacotes } from "./pages/pacotes/Pacotes";
import CreateAccount from "./pages/login/CreateAccount";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rotas Públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/recuperacao" element={<RecuperarConta />} />
          <Route path="/cadastro" element={<CreateAccount />} />
          
        </Route>

        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PersistentDrawerLeft />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulado" element={<Simulado />} />
            <Route path="/simulado/criar" element={<MonteSeuSimulado />} />
            <Route path="/simulado/resultado" element={<Resultado />} />
            <Route path="/pacotes" element={<Pacotes />} />
            <Route path="/flashcard" element={<FlashCard />} />
            <Route path="/flashcard/estudo/:baralhoId" element={<FlashcardEstudo />} />
            <Route path="/desempenho" element={<Desempenho />} />
            <Route path="/configuracao" element={<Configuracao />} />
          </Route>
        </Route>
         <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
