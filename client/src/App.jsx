import { useEffect, useState } from "react";
import "./App.css";
import GuestMode from "./pages/Guest";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/Login";
import TopbarComponent from "./components/Topbar";
import RegisterPage from "./pages/Auth/Register";

function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/home", {
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
      <TopbarComponent user={user} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage /> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
