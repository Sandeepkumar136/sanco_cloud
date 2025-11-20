// src/pages/Notes.jsx
import { useEffect, useState } from "react";
import {
  databases,
  DB_ID,
  NOTES_COLLECTION_ID,
  ID,
  Permission,
  Role,
} from "../appwrite";
import { useAuth } from "../contexts/AuthContext";

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function loadNotes() {
    try {
      const res = await databases.listDocuments(DB_ID, NOTES_COLLECTION_ID, []);
      setNotes(res.documents);
    } catch (err) {
      setError(err.message || "Failed to load notes");
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        // EDIT note
        await databases.updateDocument(DB_ID, NOTES_COLLECTION_ID, editingId, {
          title: form.title,
          content: form.content,
        });
      } else {
        // CREATE note
        const permissions = [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ];

        await databases.createDocument(
          DB_ID,
          NOTES_COLLECTION_ID,
          ID.unique(),
          {
            title: form.title,
            content: form.content,
            userId: user.$id,
          },
          permissions
        );
      }

      setForm({ title: "", content: "" });
      setEditingId(null);
      await loadNotes();
    } catch (err) {
      setError(err.message || "Failed to save note");
    }
  }

  function startEdit(note) {
    setForm({ title: note.title, content: note.content });
    setEditingId(note.$id);
  }

  async function handleDelete(noteId) {
    try {
      await databases.deleteDocument(DB_ID, NOTES_COLLECTION_ID, noteId);
      await loadNotes();
    } catch (err) {
      setError(err.message || "Failed to delete note");
    }
  }

  return (
    <section>
      <h2>Notes</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Note title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Note content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <button type="submit">
          {editingId ? "Update note" : "Add note"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ title: "", content: "" });
            }}
          >
            Cancel edit
          </button>
        )}
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Your notes</h3>
      <ul>
        {notes
          .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
          .map((note) => (
            <li key={note.$id}>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
              <small>{new Date(note.$createdAt).toLocaleString()}</small>
              <div>
                <button type="button" onClick={() => startEdit(note)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(note.$id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}
