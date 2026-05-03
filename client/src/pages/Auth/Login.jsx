import { useEffect, useState } from "react";
import TopbarComponent from "../../components/Topbar";
import { useNavigate } from "react-router-dom";

function LoginPage({ user }) {
  const [password, setPassword] = useState("");
  const [email_user, setEmailUser] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleLogin = async (ev) => {
    try {
      console.log(email_user, password);
      ev.preventDefault();
      const result = await fetch(`${import.meta.env.VITE_link}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email_user,
          password,
        }),
      });

      const data = await result.json();
      console.log(data);
      if (data.success) return navigate("/");
      else {
        setError(data.error);
        return setEmailUser(data.emailback);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <TopbarComponent />
      <div className="AuthContainer LoginContainer">
        <div className="AuthForm LoginForm">
          <form onSubmit={handleLogin} className="FormRegi">
            <h3>Login</h3>
            {error ? <p>{error}</p> : ""}
            <label htmlFor="user_email">Username/Email</label>
            <input
              id="user_email"
              type="text"
              name="user_email"
              maxLength={20}
              value={email_user}
              onChange={(e) => setEmailUser(e.target.value)}
            />
            <label htmlFor="pwd">Password</label>
            <input
              id="pwd"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" id="btnSubmit">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
