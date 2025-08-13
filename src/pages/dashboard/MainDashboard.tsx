import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "./layout";
import CardList from "./courses/Index";
import CourseView from "./courses/View";
import DashboardHome from "./home/Index";
import CourseLearningPage from "./courseProduct/Index";
import Roadmap from "./RoadMap";
import CareerPaths from "./CareerPath/Index";
import CareerView from "./CareerPath/View";
import UserProfile from "./userProfile/Index";

export default function MainDashboard() {
  return (
    <Routes>
      <Route path="courses/:id/:title" element={<CourseLearningPage />} />
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
        <Route path="profile" element={<UserProfile />} />
        <Route path="courses" element={<CardList />} />
        <Route path="courses/:id" element={<CourseView />} />
        <Route path="careerPath" element={<CareerPaths />} />
        <Route path="careerPath/:id" element={<CareerView />} />
        <Route path="roadMap" element={<Roadmap />} />
        <Route
          path="*"
          element={<h1 className="text-xl">المسار غير موجود</h1>}
        />
      </Route>
    </Routes>
  );
}
