// src/pages/Schedule.jsx
import { useEffect, useState } from "react";
import {
  databases,
  DB_ID,
  EVENTS_COLLECTION_ID,
  ID,
  Permission,
  Role,
} from "../appwrite";
import { useAuth } from "../contexts/AuthContext";

export default function Schedule() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", date: "" });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function loadEvents() {
    try {
      const res = await databases.listDocuments(DB_ID, EVENTS_COLLECTION_ID);
      setEvents(res.documents);
    } catch (err) {
      setError(err.message || "Failed to load events");
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        // EDIT event
        await databases.updateDocument(DB_ID, EVENTS_COLLECTION_ID, editingId, {
          title: form.title,
          description: form.description,
          date: form.date,
        });
      } else {
        // CREATE event
        const permissions = [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ];

        await databases.createDocument(
          DB_ID,
          EVENTS_COLLECTION_ID,
          ID.unique(),
          {
            title: form.title,
            description: form.description,
            date: form.date,
            userId: user.$id,
          },
          permissions
        );
      }

      setForm({ title: "", description: "", date: "" });
      setEditingId(null);
      await loadEvents();
    } catch (err) {
      setError(err.message || "Failed to save event");
    }
  }

  function startEdit(ev) {
    setForm({
      title: ev.title,
      description: ev.description || "",
      date: ev.date ? ev.date.substring(0, 10) : "",
    });
    setEditingId(ev.$id);
  }

  async function handleDelete(eventId) {
    try {
      await databases.deleteDocument(DB_ID, EVENTS_COLLECTION_ID, eventId);
      await loadEvents();
    } catch (err) {
      setError(err.message || "Failed to delete event");
    }
  }

  const sorted = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <section>
      <h2>Schedule</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <button type="submit">
          {editingId ? "Update event" : "Add event"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ title: "", description: "", date: "" });
            }}
          >
            Cancel edit
          </button>
        )}
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Upcoming events</h3>
      <ul>
        {sorted.map((ev) => (
          <li key={ev.$id}>
            <strong>{ev.title}</strong> –{" "}
            {new Date(ev.date).toLocaleDateString()}
            {ev.description && <> – {ev.description}</>}
            <button type="button" onClick={() => startEdit(ev)}>
              Edit
            </button>
            <button type="button" onClick={() => handleDelete(ev.$id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
