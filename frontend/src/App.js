import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from "./pages/Admin";
import Login from "./components/Auth/Login"


function App() {
  return (
    <Router>
        <Routes>
            <Route path="/admin/*" element={<Main />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </Router>
  );
}

export default App;
