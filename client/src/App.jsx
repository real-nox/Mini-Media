import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import "./css/App.css";
import "./css/Guest.css"

import Home from "./pages/Home";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";

import CreatePost from "./pages/User/Create";
import Settings from "./pages/User/Settings";
import Profile from "./pages/User/Profile";

function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_link}/`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        setUser(data.user);
        setMode(data.mode);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} />}/>
        <Route path="/login" element={<LoginPage user={user} />} />
        <Route path="/register" element={<RegisterPage user={user} /> }/>
        <Route path="/create-post" element={<CreatePost user={user} />}/>
        <Route path="/settings" element={<Settings user={user}/>}/>
        <Route path="/profile" element={<Profile user={user} />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;