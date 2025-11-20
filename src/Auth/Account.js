// src/pages/Account.jsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { account } from "../appwrite";

export default function Account() {
  const { user, logout } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function handleChangePassword(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await account.updatePassword({
        password: newPassword,
        oldPassword,
      });
      setMsg("Password updated.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message || "Failed to update password");
    }
  }

  return (
    <section>
      <h2>Account</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>

      <h3>Change password</h3>
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Current password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Update password</button>
      </form>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={logout}>Logout</button>
    </section>
  );
}
