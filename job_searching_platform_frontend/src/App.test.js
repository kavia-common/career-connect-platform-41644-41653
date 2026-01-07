import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import AppProviders from "./app/AppProviders";
import RegisterPage from "./pages/RegisterPage";

test("renders login page by default redirect flow", () => {
  render(
    <AppProviders>
      <App />
    </AppProviders>
  );
  expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
});

test("register page renders", () => {
  render(
    <AppProviders>
      <MemoryRouter initialEntries={["/register"]}>
        <RegisterPage />
      </MemoryRouter>
    </AppProviders>
  );

  expect(screen.getByText(/create your account/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/register-form/i)).toBeInTheDocument();
});

test("register validation shows mismatch password error", async () => {
  const user = userEvent.setup();

  render(
    <AppProviders>
      <MemoryRouter initialEntries={["/register"]}>
        <RegisterPage />
      </MemoryRouter>
    </AppProviders>
  );

  await user.type(screen.getByLabelText(/^name$/i), "Test User");
  await user.type(screen.getByLabelText(/^email$/i), "test@example.com");
  await user.type(screen.getByLabelText(/^password$/i), "password123");
  await user.type(screen.getByLabelText(/confirm password/i), "password456");

  await user.click(screen.getByRole("button", { name: /create account/i }));

  expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
});
