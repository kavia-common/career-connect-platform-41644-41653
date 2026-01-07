import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../state/authStore";
import { NotificationsProvider } from "../state/notificationsStore";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // Don't retry unauthorized; otherwise keep retries minimal.
          if (error?.status === 401 || error?.code === "UNAUTHORIZED") return false;
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * Hook runner mounted inside providers so it can read auth + notifications context.
 */
function RealtimeNotificationsBridge() {
  useRealtimeNotifications();
  return null;
}

/**
 * PUBLIC_INTERFACE
 * App-wide providers wrapper.
 */
export default function AppProviders({ children }) {
  // QueryClient must be stable across renders.
  const queryClient = useMemo(() => createQueryClient(), []);

  // Ensure theme attribute exists (light default).
  if (typeof document !== "undefined") {
    const current = document.documentElement.getAttribute("data-theme");
    if (!current) document.documentElement.setAttribute("data-theme", "light");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationsProvider>
          <RealtimeNotificationsBridge />
          {children}
        </NotificationsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
