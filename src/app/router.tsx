import { createBrowserRouter, useParams } from "react-router-dom";
import { App } from "./App";
import { DashboardPage } from "../pages/DashboardPage";
import { QuizLibraryPage } from "../pages/QuizLibraryPage";
import { QuizEditorPage } from "../pages/QuizEditorPage";
import { QuizPlayPage } from "../pages/QuizPlayPage";
import { QuizCompletePage } from "../pages/QuizCompletePage";
import { NotFoundPage } from "../pages/NotFoundPage";

function QuizEditorRoute() {
  const { id } = useParams();
  return <QuizEditorPage key={id ?? "new"} />;
}

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/quizzes", element: <QuizLibraryPage /> },
      { path: "/quizzes/new", element: <QuizEditorRoute /> },
      { path: "/quizzes/:id/edit", element: <QuizEditorRoute /> },
      { path: "/quizzes/:id/preview", element: <QuizPlayPage preview /> },
      { path: "/play/:id", element: <QuizPlayPage /> },
      { path: "/play/:id/complete", element: <QuizCompletePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
