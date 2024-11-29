import './App.css';
import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';

import Login from "./components/Auth/Login"
import Manager from "./pages/Manager";
import Driver from "./pages/Driver";



function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/manager/*" element={<Manager />} />
            <Route path="/driver/*" element={<Driver />} />
        </Routes>
    </Router>
  );
}

export default App;
