import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';

import Home from './pages/Home/Home.jsx';
import Register from './pages/Register/Register.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </>
  );
}

export default App;
