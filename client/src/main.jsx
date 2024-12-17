import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // Fixed import statement
import Todos from './components/Todos';
import Register from './components/Register';
import Login from './components/Login';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login page */}
        <Route path="/register" element={<Register />} />
        <Route path="/todos" element={<Todos />} /> {/* Todo page after login */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
