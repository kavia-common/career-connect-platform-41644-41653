import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";

/**
 * PUBLIC_INTERFACE
 * App root component: router host.
 */
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
