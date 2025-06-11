import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import BackgroundImg from "../assets/green_back.jpg";

const LoginUser = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("type") || "customer";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: role }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert(data.msg || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong.");
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login clicked (functionality to be added).");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        className="container shadow-lg"
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.88)",
          padding: "2rem",
          borderRadius: "12px",
          color: "#000",
        }}
      >
        <h2 className="text-center mb-4">Login as {role === "owner" ? "Owner" : "User"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control mb-3"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="btn w-100 mb-3"
            style={{ backgroundColor: "var(--primary-color)", color: "#fff" }}
          >
            Login
          </button>

          <div className="text-center mb-3">
            Not registered?{" "}
            <Link to={`/signup?type=${role}`}>Sign up now!</Link>
          </div>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline-danger w-100"
          style={{ fontWeight: "500" }}
        >
          <i className="bi bi-google me-2"></i> Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginUser;
