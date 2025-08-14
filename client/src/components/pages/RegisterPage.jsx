import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styling/RegisterStyling.css";
import { AuthContext } from "../../context/AuthContext.jsx";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, register } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const switchToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="access-container">
      <h1 className="title">Register an Account</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleRegister} className="input-group">
        <label htmlFor="Email">Email</label>
        <input
          type="email"
          id="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="Password">Password</label>
        <input
          type="password"
          id="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>
        <p className="warning">
          By continuing, you acknowledge that you understand and agree to the
          Terms & Conditions and Privacy Policy
        </p>
      </form>

      <span className="warning" id="last-line">
        Already have an account?{" "}
        <button type="button" className="link-button" onClick={switchToLogin}>
          Login instead.
        </button>
      </span>
    </div>
  );
};

export default RegisterPage;
