import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Email format validation
  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailFormat.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Make a POST request to the backend to authenticate the user
      const response = await axios.post("http://localhost:8000/login-user", {
        email,
        password,
      });

      if (response.data.status === "ok") {
        localStorage.setItem("token", response.data.data); // Store token in localStorage
        navigate("/frontend"); // Redirect to home after successful login
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ height: "100vh" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "15px",
        }}
      >
        <h2 className="text-center text-primary mb-4">Welcome Back!</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="alert alert-danger text-center py-1" role="alert">
              {error}
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <p className="text-center mt-3">
            Don't have an account?{" "}
            <span
              className="text-primary text-decoration-none"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Register Here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
