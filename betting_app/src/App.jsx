import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Bet from "./components/BetPage";
import Matches from "./components/Matches";
import "./App.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Websocket from "./components/Websocket";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/bet">Bet</Link> |{" "}
        <Link to="/matches">Matches</Link> |{" "}
        <Link to="/signup">Signup</Link> |{" "}
        <Link to="/socket">Socket</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to IPL League</h1>} />
        <Route path="/bet" element={<Bet />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/socket" element={<Websocket />} />
      </Routes>
    </Router>
  );
}

export default App;
