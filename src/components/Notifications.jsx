"use client";

import { createContext, useContext, useState, useCallback } from "react";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  return (
    <NotificationsContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {notifications.map(({ id, message, type }) => (
          <div
            key={id}
            className={`p-4 rounded shadow-lg ${
              type === "error"
                ? "bg-red-500"
                : type === "success"
                ? "bg-green-500"
                : "bg-blue-500"
            } text-white`}
          >
            {message}
          </div>
        ))}
      </div>
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
}
