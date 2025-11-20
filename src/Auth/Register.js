// src/pages/Register.jsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(form);
      navigate("/notes");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  }

  function onChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  return (
    <section>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First name"
          value={form.firstName}
          onChange={e => onChange("firstName", e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last name"
          value={form.lastName}
          onChange={e => onChange("lastName", e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => onChange("email", e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => onChange("password", e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Repeat password"
          value={form.repeatPassword}
          onChange={e => onChange("repeatPassword", e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}
