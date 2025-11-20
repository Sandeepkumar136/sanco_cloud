// src/pages/Tasks.jsx
import { useEffect, useState } from "react";
import {
  databases,
  DB_ID,
  TASKS_COLLECTION_ID,
  ID,
  Permission,
  Role,
} from "../appwrite";
import { useAuth } from "../contexts/AuthContext";
import { useTc } from "../contexts/TaskContentContext";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // null = create mode
  const [searchTerm, setSearchTerm] = useState(""); // search text
  const { openTc, closeTc, isTcontentOpen, selectedTask } = useTc();

  async function loadTasks() {
    try {
      const res = await databases.listDocuments(DB_ID, TASKS_COLLECTION_ID);
      setTasks(res.documents);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        // EDIT existing task
        await databases.updateDocument(DB_ID, TASKS_COLLECTION_ID, editingId, {
          title: form.title,
          description: form.description,
          dueDate: form.dueDate || null,
        });
      } else {
        // CREATE new task
        const permissions = [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ];

        await databases.createDocument(
          DB_ID,
          TASKS_COLLECTION_ID,
          ID.unique(),
          {
            title: form.title,
            description: form.description,
            dueDate: form.dueDate || null,
            isCompleted: false,
            userId: user.$id,
          },
          permissions
        );
      }

      setForm({ title: "", description: "", dueDate: "" });
      setEditingId(null);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to save task");
    }
  }

  async function toggleCompleted(task) {
    try {
      await databases.updateDocument(DB_ID, TASKS_COLLECTION_ID, task.$id, {
        isCompleted: !task.isCompleted,
      });
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to update task");
    }
  }

  function startEdit(task) {
    setForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
    });
    setEditingId(task.$id);
  }

  async function handleDelete(taskId) {
    try {
      await databases.deleteDocument(DB_ID, TASKS_COLLECTION_ID, taskId);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to delete task");
    }
  }

  function handleCancel() {
    setForm({ title: "", description: "", dueDate: "" });
    setEditingId(null);
  }

  const isDirty =
    form.title.trim() !== "" ||
    form.description.trim() !== "" ||
    form.dueDate.trim() !== "";

  const filtered = tasks.filter((task) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(term) ||
      (task.description &&
        task.description.toLowerCase().includes(term))
    );
  });

  const sorted = filtered.sort(
    (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
  );

  const totalVisibleTasks = sorted.length;

  return (
    <>
      <section className="tasks-container">
        <div className="task-up-contain">
          <div className="task-up-cover">
            <h3 className="heading-task">Today</h3>
            <form className="task-form" onSubmit={handleSubmit}>
              <input
                className="t-inp"
                type="text"
                placeholder="Fix tire this weekend"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />
              <input
                type="text"
                className="t-inp t"
                placeholder="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <div className="t-inp-toggle">
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className="t-date"
                />

                <div className="t-t-l-c">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={!isDirty}
                  >
                    Cancel
                  </button>
                  <button type="submit">
                    {editingId ? "Update task" : "Add task"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {error && (
          <p style={{ color: "red", fontSize: "1rcap" }}>{error}</p>
        )}

        <div className="t-low-contain">
          <div className="t-s-contain">
            <h2 className="heading-t">Tasks {totalVisibleTasks}</h2>

            <input
              className="t-searchbar"
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ul className="tasks-items">
            {sorted.map((task) => (
              <li
                className="tasks-m-t"
                key={task.$id}
                onClick={() => openTc(task)} // open details on row click
              >
                <label className="task-t-title">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // do not open details when toggling
                      toggleCompleted(task);
                    }}
                    className="ch-t-btn"
                    style={{
                      color: task.isCompleted ? "green" : "black",
                    }}
                  >
                    <i
                      className={`ch-icon bi ${
                        task.isCompleted ? "bi-check-circle" : "bi-circle"
                      }`}
                    ></i>
                  </button>
                  <p className="t-title">{task.title}</p>
                </label>
                <div className="m-t-contain">
                  {task.dueDate && (
                    <small className="ts-d-d">
                      {" "}
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </small>
                  )}
                  <button
                    className="btn-t-ed"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // don't open details
                      startEdit(task);
                    }}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn-t-ed d"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // don't open details
                      handleDelete(task.$id);
                    }}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Task details overlay */}
      {isTcontentOpen && selectedTask && (
        <div className="Tc-overlay" onClick={closeTc}>
          <div
            className="Tc-box"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <button
              className="tc-close-btn"
              type="button"
              onClick={closeTc}
            >
              ×
            </button>

            <h3 className="tc-title">{selectedTask.title}</h3>
            {selectedTask.description && (
              <p className="tc-desc">{selectedTask.description}</p>
            )}
            <p className="tc-status">
              Status:{" "}
              {selectedTask.isCompleted ? "Completed" : "Pending"}
            </p>
            {selectedTask.dueDate && (
              <p className="tc-due">
                Due:{" "}
                {new Date(
                  selectedTask.dueDate
                ).toLocaleDateString()}
              </p>
            )}
            <p className="tc-created">
              Created:{" "}
              {new Date(
                selectedTask.$createdAt
              ).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
