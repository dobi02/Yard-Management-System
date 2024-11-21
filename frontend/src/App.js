import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from "./pages/Admin";


function App() {
  return (
    <Router>
        <Routes>
            <Route path="/admin/*" element={<Main />} />
        </Routes>
    </Router>
  );
}

export default App;
