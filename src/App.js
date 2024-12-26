import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import PickWinner from "./PickWinner";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/PickWinner">Pick Winner</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/PickWinner" element={<PickWinner />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;