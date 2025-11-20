// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { account } from "../appwrite";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      // URL of your reset password page (frontend route)
      const redirectUrl = window.location.origin + "/reset-password";
      await account.createRecovery(email, redirectUrl);
      setMsg("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    }
  }

  return (
    <section>
      <h2>Forgot password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send reset link</button>
      </form>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </section>
  );
}
