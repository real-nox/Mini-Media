import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopbarComponent from "../../components/Topbar";

function RegisterPage() {
  const [display_name, setDisplay] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPDW] = useState("");
  const [checkPwd, setPWDCheck] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (ev) => {
    try {
      ev.preventDefault();
      const result = await fetch(`${import.meta.env.VITE_link}/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: display_name,
          username,
          email,
          password: pwd,
          checkPwd,
        }),
      });

      const data = await result.json();

      if (data)
        setError(data.error)

    } catch (err) {
      console.log(err);
    }
  };

  window.addEventListener("load", (ev) => {
    let points = {
        username : false,
        email: false,
        password: false,
        cpwd: false
    }

    //Check username, if it includes special char, numbers, same for password

    document.getElementById("username").addEventListener("input", (ev) => {
        if (ev.target.value.toUpperCase()) {
            points.username = false
        } else {
            points.username = true
        }
    })

    function checkValidity() {
        if (points.cpwd && points.email && points.password && points.username)
            return document.getElementById("btnSubmit").disabled = true
        return document.getElementById("btnSubmit").disabled = false
    }
  })

  return (
    <>
      <TopbarComponent />
      <div className="RegisterContainer">
        <div className="RegisterForm">
          <form onSubmit={handleRegister} className="FormRegi">
            <h3>Register</h3>
            {
                console.log(error)
            }
            {error ? <p>{error}</p> : ""}
            <label htmlFor="display_name">Display Name</label>
            <input
              id="displayn"
              type="text"
              name="display_name"
              maxLength={20}
              onChange={(e) => setDisplay(e.target.value)}
            />
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="pwd"
              type="password"
              name="password"
              onChange={(e) => setPDW(e.target.value)}
            />
            <label htmlFor="confirm_pwd">Confirm Password</label>
            <input
              id="pwdconfirm"
              type="password"
              name="confirm_pwd"
              onChange={(e) => setPWDCheck(e.target.value)}
            />
            <button type="submit" id="btnSubmit">Create Account</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
