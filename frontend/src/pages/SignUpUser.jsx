import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import BackgroundImg from "../assets/green_back.jpg";

const SignUpUser = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "customer";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      const res = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          username: form.username,
          password: form.password,
          type: type,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful!");
        navigate(`/login?type=${type}`);
      } else {
        alert(data.error || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
          backgroundColor: "rgba(255,255,255,0.88)",
          padding: "2rem",
          borderRadius: "12px",
        }}
      >
        <h2 className="text-center mb-4">
          Create a {type === "owner" ? "Owner" : "User"} Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-2 mb-3">
            <div className="col">
              <input
                type="text"
                name="firstName"
                className="form-control"
                placeholder="First Name"
                required
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="lastName"
                className="form-control"
                placeholder="Last Name"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <input
            type="text"
            name="username"
            className="form-control mb-3"
            placeholder="Username (Email)"
            required
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            className="form-control mb-3"
            placeholder="Password"
            required
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            className="form-control mb-3"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
          />
          <button
            className="btn w-100"
            style={{ backgroundColor: "var(--primary-color)", color: "#fff" }}
            type="submit"
          >
            Sign Up
          </button>
          <div className="text-center mt-3">
            Already have an account?{" "}
            <Link to={`/login?type=${type}`}>Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpUser;
