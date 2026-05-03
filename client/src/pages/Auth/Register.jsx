import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopbarComponent from "../../components/Topbar";

function RegisterPage({user}) {
  const [display_name, setDisplay] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPDW] = useState("");
  const [checkPwd, setPWDCheck] = useState("");

  const [validate, setValidation] = useState({
    username: false,
    password: false,
    cpwd: false,
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleRegister = async (ev) => {
    try {
      ev.preventDefault();
      const result = await fetch(`${import.meta.env.VITE_link}/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nickname: display_name,
          username,
          email,
          password: pwd,
          checkPwd,
        }),
      });

      const data = await result.json();

      if (data) {
        if (data.success)
          return navigate("/login")
        setError(data.error);}
    } catch (err) {
      console.log(err);
    }
  };

  const username_special_char_reg = /^[a-zA-Z0-9._-]+$/;
  const special_char_reg = /[!@#$%^&*()\-_=+\[\]{};':",.<>/?\\|]/;
  const num_range_reg = /[0-9]/;
  const cap_letters_char = /[A-Z]/;
  const low_letters_char = /[a-z]/;

  const validateUsername = (username) => {
    return username_special_char_reg.test(username)
  }

  const validatePWD = (password) => {
    let score = 0

    if (special_char_reg.test(password)) score++
    if (num_range_reg.test(password)) score++
    if (cap_letters_char.test(password)) score++
    if (low_letters_char.test(password)) score++

    return score >= 3
  }

  const validateCPWD = (pwd, confirmpwd) => {
    console.log(pwd, confirmpwd)
    return pwd == confirmpwd && pwd.length > 0
  }

  const handleUsername = (ev) => {
    const chars = ev.target.value;
    console.log(chars);
    setUsername(chars)
    setValidation((prev) => ({
      ...prev,
      username: validateUsername(chars)
    }))
  };

  const handlePassword = (ev) => {
    const chars = ev.target.value
    setPDW(chars)
    setValidation((prev) => ({
      ...prev,
      password: validatePWD(chars),
      cpwd: validateCPWD(chars, checkPwd)
    }))
  };

  const handleConfirmPWD = (ev) => {
    const chars = ev.target.value
    setPWDCheck(chars)
    setValidation((prev) => ({
      ...prev,
      cpwd: validateCPWD(pwd, chars)
    }))
  };

  const handleValidity = validate.username && validate.cpwd && validate.password

  return (
    <>
      <TopbarComponent />
      <div className="AuthContainer RegisterContainer">
        <div className="AuthForm RegisterForm">
          <form onSubmit={handleRegister} className="FormRegi">
            <h3>Register</h3>
            {error ? <p>{error}</p> : ""}
            <label htmlFor="displayn">Display Name</label>
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
              onChange={handleUsername}
            />
            <p>{validate.username ? "" : "Incorrect"}</p>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="pwd">Password</label>
            <input
              id="pwd"
              type="password"
              name="password"
              onChange={handlePassword}
            />
            <p>
              {validate.password
                ? "✓ Strong password"
                : "✗ Need: 5+ chars, numbers, capital, lowercase, special char"}
            </p>
            <label htmlFor="pwdconfirm">Confirm Password</label>
            <input
              id="pwdconfirm"
              type="password"
              name="confirm_pwd"
              onChange={handleConfirmPWD}
            />
            <p>{validate.cpwd ? "Matching" : "Not matching"}</p>
            <button type="submit" id="btnSubmit" disabled={!handleValidity}>
              Create Account
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
