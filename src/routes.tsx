import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ResultsPage from "./pages/Results/ResultsPage";
import Vote from "./pages/Vote/Vote";
import Home from "./pages/Home/Home";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login/Login";
import { AuthRoute, ProtectedRoute } from "./layouts/ProtectedRoute";
import { ErrorPage } from "./pages/ErrorPage";

export const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/vote/:electionId",
        element: <Vote />,
      },
      {
        path: "/live-results/:electionId",
        element: <ResultsPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <AuthRoute>
        <AuthLayout />
      </AuthRoute>
    ),
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  // {
  //   path: "admin",
  //   element: (
  //     <ProtectedRoute adminOnly>
  //       <AdminLayout />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       element: <AdminDashboard />,
  //     },
  //   ],
  // },
  {
    path: "*",
    element: <ErrorPage status={404} />,
  },
]);
