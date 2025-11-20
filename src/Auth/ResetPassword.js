// src/pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { account } from "../appwrite";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const userId = params.get("userId");
  const secret = params.get("secret");

  useEffect(() => {
    if (!userId || !secret) {
      setError("Invalid or missing reset token.");
    }
  }, [userId, secret]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== repeat) {
      setError("Passwords do not match");
      return;
    }
    try {
      await account.updateRecovery({
        userId,
        secret,
        password,
        passwordAgain: repeat,
      });
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    }
  }

  if (!userId || !secret) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>Reset password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Repeat new password"
          value={repeat}
          onChange={e => setRepeat(e.target.value)}
          required
        />
        <button type="submit">Update password</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {done && <p style={{ color: "green" }}>Password updated. Redirecting…</p>}
    </section>
  );
}
