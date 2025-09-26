import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "./layout";
import CardList from "./courses/Index";
import CourseView from "./courses/View";
import DashboardHome from "./home/Index";
import Roadmap from "./RoadMap";
import CareerPaths from "./CareerPath/Index";
import CareerView from "./CareerPath/View";
import UserProfile from "./userProfile/Index";
import SpaceView from "./ai/spaces/View";
import CoursePlayground from "./courseProduct/Index";
import LearnPlayGround from "@/shared/ai/LearnPlayground/Index";

const Placeholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-xl">{title}</h1>
  </div>
);

export default function MainDashboard() {
  return (
    <Routes>
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
        <Route path="courses/:id/learn" element={<CoursePlayground />} />
        <Route path="careerPath" element={<CareerPaths />} />
        <Route path="careerPath/:id" element={<CareerView />} />
        <Route path="roadMap" element={<Roadmap />} />
        <Route path="spaces/:id" element={<SpaceView />} />
        <Route path="search" element={<Placeholder title="البحث" />} />
        <Route path="explore" element={<Placeholder title="استكشاف" />} />
        <Route path="history" element={<Placeholder title="التاريخ" />} />
        <Route
          path="create-space"
          element={<Placeholder title="إنشاء مساحة" />}
        />
        <Route path="learn/workspace/:id" element={<LearnPlayGround />} />
        <Route
          path="*"
          element={<h1 className="text-xl">المسار غير موجود</h1>}
        />
      </Route>
    </Routes>
  );
}
