import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage, HomePAGE, LoginPage, SingupPage } from "./index";
import Storage from "@/lib/Storage";

const publicRoutes = [
  { path: "/", element: <HomePAGE /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/singup", element: <SingupPage /> },
];

const privateRoutes: any[] = [
  { path: "/dashboard", element: <DashboardPage /> },
];

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = Storage.get("auth");
  return auth?.user.isVerify ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = Storage.get("auth");
  return auth?.user.isVerify ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<PublicRoute>{element}</PublicRoute>}
          />
        ))}

        {privateRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<PrivateRoute>{element}</PrivateRoute>}
          />
        ))}

        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
