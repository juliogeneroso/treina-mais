import { BrowserRouter, Routes, Route } from "react-router-dom";
import PersistentDrawerLeft from "./components/header/Drawer";
import { Simulado } from "./pages/simulado/Simulado";
import { Resultado } from "./pages/simulado/resultado/Resultado";
import { FlashCard } from "./pages/flashcard/FlashCard";
import Dashboard from "./pages/dashboard/Dashboard";
import Desempenho from "./pages/desempenho/Desempenho";
import MonteSeuSimulado from "./pages/simulado/criacao/MonteSeuSimulado";
import SimuladoPendente from "./pages/simulado/pendente/SimuladoPendente";
import Login from "./pages/login/Login";
import RecuperarConta from "./pages/login/RecuperarConta";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import EmConstrucao from "./pages/redirecionamentos/EmConstrucao";
import NaoEncontrado from "./pages/redirecionamentos/NaoEncontrado";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rotas Públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/recuperacao" element={<RecuperarConta />} />
          <Route path="/planos" element={<EmConstrucao />} />
          
        </Route>

        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PersistentDrawerLeft />}>

            <Route path="/" element={<Dashboard />} />
            <Route path="/simulado/:id" element={<Simulado />} />
            <Route path="/simulado/criar" element={<MonteSeuSimulado />} />
            <Route path="/simulado/pendente" element={<SimuladoPendente />} />
            <Route path="/baralhos" element={<Resultado />} />
            <Route path="/flashcard" element={<FlashCard />} />
            <Route path="/desempenho" element={<Desempenho />} />

          </Route>
        </Route>
         <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
