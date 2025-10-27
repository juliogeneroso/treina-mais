import { useState } from 'react'
import './App.css'
import PersistentDrawerLeft from './components/header/Drawer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <PersistentDrawerLeft />
      <Routes>
        <Route path="/" /* element={<Dashboard />} */ />
        <Route path="/simulados" /* element={<Simulados />} */ />
        <Route path="/baralhos" /* element={<Baralhos />} */ />
      </Routes>
    </BrowserRouter>
  )
}

export default App
