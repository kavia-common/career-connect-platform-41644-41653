import { render, screen } from "@testing-library/react";
import App from "./App";
import AppProviders from "./app/AppProviders";

test("renders login page by default redirect flow", () => {
  render(
    <AppProviders>
      <App />
    </AppProviders>
  );
  expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
});
