import React from "react";
import "./Signin.css";
import { useNavigate, Link } from "react-router-dom";

export default function Signin() {
  const navigate = useNavigate();

  // State for form inputs
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Signup success:", data);
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="login-page">
      <div className="auth-container">

        {/* LEFT SECTION */}
        <div className="auth-left">
          <h1>Welcome back!</h1>
          <p>
            To keep connected with us <br />
            please login with your personal info
          </p>

          <Link to="/login" className="auth-signin-btn">
            SIGN IN
          </Link>
        </div>

        {/* RIGHT SECTION */}
        <div className="auth-right">
          <h1>Create Account</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="auth-signup-btn">
              SIGN UP
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
