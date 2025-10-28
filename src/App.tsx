import "./App.css";
import PersistentDrawerLeft from "./components/header/Drawer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PersistentDrawerLeft />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/simulados" /* element={<Simulados />} */ />
          <Route path="/baralhos" /* element={<Baralhos />} */ />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
