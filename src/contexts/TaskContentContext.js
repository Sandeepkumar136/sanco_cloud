// src/contexts/TaskContentContext.jsx
import { createContext, useContext, useState } from "react";

const TaskContentContext = createContext(null);

export function TaskContentProvider({ children }) {
  const [isTcontentOpen, setIsTcontentOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  function openTc(task) {
    setSelectedTask(task);
    setIsTcontentOpen(true);
  }

  function closeTc() {
    setIsTcontentOpen(false);
    setSelectedTask(null);
  }

  const value = { isTcontentOpen, openTc, closeTc, selectedTask };

  return (
    <TaskContentContext.Provider value={value}>
      {children}
    </TaskContentContext.Provider>
  );
}

export function useTc() {
  const ctx = useContext(TaskContentContext);
  if (!ctx) {
    throw new Error("useTc must be used inside TaskContentProvider");
  }
  return ctx;
}
