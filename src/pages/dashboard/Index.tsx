import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layout";

export default function MainDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />

        <Route
          path="overview"
          element={
            <h1 className="text‑2xl font‑bold">مرحباً بك في لوحة التحكم</h1>
          }
        />

        <Route path="courses" element={<> COURSES</>} />
        <Route path="tracks" element={<> roadmas</>} />

        <Route
          path="*"
          element={<h1 className="text‑xl">المسار غير موجود</h1>}
        />
      </Routes>
    </DashboardLayout>
  );
}
