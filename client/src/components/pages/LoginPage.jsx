import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../Styling/RegisterStyling.css';

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Username: username, Password: password }),
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "Error during login");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            setError("Error during login: " + error.message);
        }
    };

    return (
        <div className="login-container">
            <h1>Login to continue</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleLogin} className="input-group">
                <label htmlFor="Username">Username</label>
                <input
                    type="text"
                    id="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label htmlFor="Password">Password</label>
                <input
                    type="password"
                    id="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;