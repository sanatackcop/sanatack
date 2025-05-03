import React from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";

import DashboardLayout from "./layout";
import CardList from "./courses/Index";
import CourseView from "./courses/View";
import DashboardHome from "./home/Index";
import CourseLearningPage from "./courseProduct/Index";

const CourseProduct: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CourseLearningPage
      logoSrc="/logo-light.svg"
      modules={[]}
      onBack={() => navigate(-1)}
    />
  );
};

export default function MainDashboard() {
  return (
    <Routes>
      <Route path="courses/:id/:courseName/*" element={<CourseProduct />} />

      <Route
        path="/"
        element={
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<DashboardHome />} />
        <Route path="courses" element={<CardList />} />
        <Route path="courses/:id" element={<CourseView />} />
        <Route path="tracks" element={<div>roadmaps</div>} />
        <Route
          path="*"
          element={<h1 className="text-xl">المسار غير موجود</h1>}
        />
      </Route>
    </Routes>
  );
}
