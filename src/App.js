import logo from "./logo.svg";
import "./App.css";
import { useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./views/Home";
import SearchHistory from "./views/searchHistory";
import { AuthContext } from "./contexts/AuthProvider";

function App() {
  const { login, user, logout } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/searchHistory">History</Link>
          </li>
        </ul>
      </nav>
      <div>
        {user.loggedIn ? (
          <>
            <button onClick={logout}>Logout</button>
            <p>Current User: {user.displayName} </p>
          </>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/searchHistory" element={<SearchHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
