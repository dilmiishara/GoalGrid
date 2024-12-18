import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Todos from "./components/Todos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/todos" element={<Todos />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
