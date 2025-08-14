import React, { use, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styling/RegisterStyling.css";
import { AuthContext } from "../../context/AuthContext.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const switchToCreateAccount = () => {
    navigate("/register");
  };

  const forgotPassword = (e) => {
    e.preventDefault();
    alert("Soon");
  };

  return (
    <div className="access-container">
      <h1 className="title">Enter StellarSightings</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin} className="input-group">
        <label htmlFor="Username">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <label htmlFor="Password">Password</label>
        <input
          type="password"
          id="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button type="submit">Enter</button>
        <button type="button" className="link-button" onClick={forgotPassword}>
          Forgot password?
        </button>
        <p className="warning">
          By continuing, you acknowledge that you understand and agree to the
          Terms & Conditions and Privacy Policy
        </p>
      </form>

      <span className="warning" id="last-line">
        New to StellarSightings?{" "}
        <button
          type="button"
          className="link-button"
          onClick={switchToCreateAccount}
        >
          Create an account.
        </button>
      </span>
    </div>
  );
};

export default LoginPage;
