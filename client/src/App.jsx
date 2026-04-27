import { useEffect, useState } from "react";
import "./App.css";
import GuestMode from "./pages/Guest";
import { BrowserRouter as Router } from "react-router-dom";

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
      <Router>{user ? GuestMode() : GuestMode()}</Router>
  );
}

export default App;
