import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AppShell from "../app/AppShell";
import { useAuth } from "../state/authStore";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";

// Placeholder pages
import JobsPage from "../pages/JobsPage";
import JobDetailsPage from "../pages/JobDetailsPage";
import AiJobMatchingPage from "../pages/AiJobMatchingPage";
import ProfilePage from "../pages/ProfilePage";
import MockTestsPage from "../pages/MockTestsPage";
import NotificationsPage from "../pages/NotificationsPage";
import ChallengesPage from "../pages/ChallengesPage";
import ApplicationsPage from "../pages/ApplicationsPage";
import MentorPage from "../pages/MentorPage";

/**
 * PUBLIC_INTERFACE
 * PublicOnlyRoute: prevents authenticated users from accessing public auth pages.
 */
function PublicOnlyRoute({ children }) {
  const auth = useAuth();
  if (auth.status === "authenticated" && auth.session && auth.user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

/**
 * PUBLIC_INTERFACE
 * AppRoutes defines all route mappings.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/ai-matching" element={<AiJobMatchingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/tests" element={<MockTestsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/mentor" element={<MentorPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
