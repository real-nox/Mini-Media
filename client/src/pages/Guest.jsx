import { Link, Route, Routes } from "react-router-dom";
import Home from "./Home";

export default function GuestMode() {
  return (
    <div className="TopBar">
      <div className="ItemsBar">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Routes>
            <Route path="/profile" element={<Home />}></Route>
        </Routes>
      </div>
    </div>
  );
}
