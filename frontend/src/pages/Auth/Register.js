import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  let Navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  let emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName) {
      alert("Please type your Full Name");
      return;
    }
    if (!emailFormat.test(email)) {
      alert("Please type your email properly");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least six characters");
      return;
    }

    const user = {
      name: fullName,
      email,
      password,
    };

    try {
      const response = await axios.post("http://localhost:8000/register", user);

      if (response.data.status === "ok") {
        alert("A new user has been successfully added");
        Navigate("/login");
      } else {
        alert(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Error registering user");
    }
  };

  return (
    <main className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-center text-primary mb-4">Create an Account</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="newfullName"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="newemail"
            />
          </div>
          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="newpassword"
            />
            <i
              onClick={togglePasswordVisibility}
              className="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"
              style={{ cursor: "pointer", fontSize: "1.2rem" }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </i>
          </div>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none">
              Login here
            </Link>
          </p>
          <button className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </main>
  );
}
