import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) navigate("/");
  });

  const login = async (e) => {
    e.preventDefault();
    const result = await fetch("http://localhost:8000/login", {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const isLoggedIn = await result.json();

    if (isLoggedIn.auth) {
      localStorage.setItem("user", JSON.stringify(isLoggedIn.result));
      localStorage.setItem("token", JSON.stringify(isLoggedIn.auth));
      navigate("/");
    } else {
      alert(isLoggedIn.result);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={login}>
        <div>
          <label htmlFor="email">Enter Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Enter Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
