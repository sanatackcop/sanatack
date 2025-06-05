import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePAGE, LoginPage, SingupPage } from "./index";
import Storage from "@/lib/Storage";
import AdminDashboard from "@/admin/pages/Index";
import { DASHBOARDTYPE } from "./types/platfrom";
import MainDashboard from "@/pages/dashboard/MainDashboard";

const publicRoutes = [
  { path: "/", element: <HomePAGE /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SingupPage /> },
];

const privateRoutes = [{ path: "/dashboard/*", element: <MainDashboard /> }];
const adminRoutes = [{ path: "/admin", element: <AdminDashboard /> }];

type Auth = {
  user?: { isVerify?: boolean; role?: string };
};

const getAuth = (): Auth | undefined => Storage.get("auth");

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = getAuth();
  return auth?.user?.isVerify ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const auth = getAuth();
  // const isAdmin = auth?.user?.isVerify && auth?.user?.role?.toLowerCase() === ADMIN_ROLE;
  // return isAdmin ? <>{children}</> : <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = getAuth();
  return auth?.user?.isVerify ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

const UsersRouter: React.FC = () => (
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

      {adminRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<AdminRoute>{element}</AdminRoute>}
        />
      ))}

      <Route path="*" element={<h1>404 – Page Not Found</h1>} />
    </Routes>
  </BrowserRouter>
);

const AdminRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {adminRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<AdminRoute>{element}</AdminRoute>}
        />
      ))}
      <Route path="*" element={<h1>404 – Page Not Found</h1>} />
    </Routes>
  </BrowserRouter>
);

interface RouterProps {
  switch_dashboard: DASHBOARDTYPE;
}

const Router: React.FC<RouterProps> = ({ switch_dashboard }) => {
  switch (switch_dashboard) {
    case DASHBOARDTYPE.ADMIN:
      return <AdminRouter />;
    default:
      return <UsersRouter />;
  }
};

export default Router;
