import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { QuizStoreProvider } from "./hooks/useQuizStore";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QuizStoreProvider>
      <RouterProvider router={router} />
    </QuizStoreProvider>
  </React.StrictMode>,
);
