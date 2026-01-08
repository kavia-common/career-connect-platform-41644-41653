import React, { createContext, useContext, useMemo, useReducer } from "react";
import { getUnreadCount, loadNotifications } from "../utils/notificationsStorage";

const NotificationsContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "SET_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };
    default:
      return state;
  }
}

/**
 * PUBLIC_INTERFACE
 * NotificationsProvider: lightweight UI state (unread count etc.).
 */
export function NotificationsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { unreadCount: 0 });

  const updateUnreadCount = () => {
    const notifications = loadNotifications();
    dispatch({ type: "SET_UNREAD_COUNT", payload: getUnreadCount(notifications) });
  };

  const value = useMemo(
    () => ({
      ...state,
      setUnreadCount: (n) => dispatch({ type: "SET_UNREAD_COUNT", payload: n }),
      updateUnreadCount,
    }),
    [state]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

/**
 * PUBLIC_INTERFACE
 * Hook to access notifications store.
 */
export function useNotificationsStore() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotificationsStore must be used within <NotificationsProvider />"
    );
  return ctx;
}
