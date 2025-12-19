import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePAGE, LoginPage, SingupPage } from "./index";
import Storage from "@/lib/Storage";
import { DASHBOARDTYPE as DASHBOARD_TYPE } from "./types/platfrom";
import MainDashboard from "@/components/layout/MainDashboard";
import ModulesPage from "@/admin/pages/modules.page";
import CoursePage from "@/admin/pages/course.page";
import AdminDashboard from "@/admin/Index";
import LessonPage from "@/admin/pages/lesson.page";
import MaterialPage from "@/admin/pages/material.page";
import MappedMaterials from "@/admin/pages/mapped.materials.page";
import NotFoundPage from "@/lib/not.found";
import MappedLessons from "@/admin/pages/mapped.lessons.page";
import MappedModules from "@/admin/pages/mapped.modules.page";
import RoadmapsPage from "@/admin/pages/roadmap.page";
import UsagePage from "@/admin/pages/usage.page";
import TermsAndConditions from "@/landingpage/TermsAndConditions";
import PrivacyPolicy from "@/landingpage/PrivacyPolicy";
import ContactUs from "@/landingpage/ContactUs";
import PaymentCallback from "@/pages/payment/callback/PaymentCallback";
import { ForgotPassword } from "@/pages/auth/login/ForgotPassword";

const publicRoutes = [
  { path: "/", element: <HomePAGE /> },
  { path: "/terms", element: <TermsAndConditions /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/contact", element: <ContactUs /> },
  { path: "/signup", element: <SingupPage /> },
];

const privateRoutes = [
  { path: "/dashboard/*", element: <MainDashboard /> },
  { path: "/payment/callback", element: <PaymentCallback /> },
];
const adminRoutes = [
  {
    path: "/",
    element: <h1 className="text-center text-3xl">Welcome to Admin</h1>,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    children: [
      { path: "", element: <CoursePage /> },
      { path: "roadmaps", element: <RoadmapsPage /> },
      { path: "courses", element: <CoursePage /> },
      { path: "courses/:id", element: <MappedModules /> },
      { path: "modules", element: <ModulesPage /> },
      { path: "modules/:id", element: <MappedLessons /> },
      { path: "lessons", element: <LessonPage /> },
      { path: "lessons/:id", element: <MappedMaterials /> },
      { path: "materials", element: <MaterialPage /> },
      { path: "usage", element: <UsagePage /> },
    ],
  },
];

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

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

const AdminRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {adminRoutes.map(({ path, element, children }) => (
        <Route
          key={path}
          path={path}
          element={<AdminRoute>{element}</AdminRoute>}
        >
          {children?.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

interface RouterProps {
  switch_dashboard: DASHBOARD_TYPE;
}

const Router: React.FC<RouterProps> = ({ switch_dashboard }) => {
  switch (switch_dashboard) {
    case DASHBOARD_TYPE.ADMIN:
      return <AdminRouter />;
    default:
      return <UsersRouter />;
  }
};

export default Router;
