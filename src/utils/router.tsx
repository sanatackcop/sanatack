import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ArticlesList,
  HomePAGE,
  ArticlePage,
  LoginPage,
  SingupPage,
} from "./index";
import WritePage from "@/pages/articles/WritePage";

const publicRoutes = [
  { path: "/", element: <HomePAGE /> },
  { path: "/articles/list", element: <ArticlesList /> },
  { path: "/article/:id", element: <ArticlePage /> },
  { path: "/write", element: <WritePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/singup", element: <SingupPage /> },
];

// const privateRoutes = [
//   // { path: "/dashboard", element: <Dashboard /> },
// ];

// const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
//   const isAuthenticated = !!localStorage.getItem("token");
//   return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
// };

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* Private Routes */}
        {/* {privateRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<PrivateRoute>{element}</PrivateRoute>}
          />
        ))} */}

        {/* Fallback Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
