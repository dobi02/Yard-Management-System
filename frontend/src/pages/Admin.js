import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import YardLayout from '../components/Dashboard/YardLayout'
import Settings from "../components/Auth/Setting";

const Admin = () => {
      return (
    <div>
      <Outlet /> {/* 자식 라우트가 렌더링되는 위치 */}

      <Routes>
          <Route path="/dashboard" element={<AdminDashboard />} /> {/* /admin/dashboard 경로에 해당 */}
          <Route path="/yardlayout" element={<YardLayout />} /> {/* /admin/yardlayout 경로에 해당 */}
          <Route path="/settings" element={<Settings />} /> {/* /admin/settings 경로에 해당 */}
      </Routes>
    </div>
  );
};

export default Admin;