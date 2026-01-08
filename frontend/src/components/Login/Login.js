import React from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // State to capture input values
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login success:", data);
        // Save JWT token to localStorage
        localStorage.setItem("token", data.token);
        // Redirect to home page
        navigate("/home");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="login-page">
      <div className="auth-container">

        {/* LEFT SECTION */}
        <div className="auth-right">
          <h1>Sign in to<br /> your account</h1>

          <form onSubmit={handleSubmit}>
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

            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>

            <button type="submit" className="auth-signup-btn">
              SIGN IN
            </button>
          </form>
        </div>

        {/* RIGHT SECTION */}
        <div className="auth-left">
          <h1>Hello Friend</h1>
          <h5>
            Enter your personal details <br />
            and start your journey with us
          </h5>
          <br />
          <Link to="/signup" className="auth-signin-btn">
            SIGN UP
          </Link>
        </div>

      </div>
    </div>
  );
}
