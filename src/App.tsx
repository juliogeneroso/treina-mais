import { BrowserRouter, Routes, Route } from "react-router-dom";
import PersistentDrawerLeft from "./components/header/Drawer";
import { Simulado } from "./pages/simulado/Simulado";
import { Resultado } from "./pages/simulado/resultado/Resultado";
import { FlashCard } from "./pages/flashcard/FlashCard";
import Dashboard from "./pages/dashboard/Dashboard";
import Desempenho from "./pages/desempenho/Desempenho";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout */}
        <Route element={<PersistentDrawerLeft />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/simulados" element={<Simulado />} />
          <Route path="/baralhos" element={<Resultado />} />
          <Route path="/flashcard" element={<FlashCard />} />
          <Route path="/desempenho" element={<Desempenho />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
