import React from 'react';
import {Routes, Route, Outlet, Navigate} from 'react-router-dom';
import ManagerDashboard from '../components/Dashboard/ManagerDashboard';
import YardLayout from '../components/Dashboard/YardLayout'
import Settings from "../components/Auth/Setting";
import TransactionPage from "../components/Dashboard/TransactionPage";
import TestPage from '../components/Dashboard/TestPage';

const Manager = () => {
      return (
    <div>
      <Outlet /> {/* 자식 라우트가 렌더링되는 위치 */}

      <Routes>
          <Route path="/" element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="/dashboard" element={<ManagerDashboard />} /> {/* /admin/dashboard 경로에 해당 */}
          <Route path="/yardlayout" element={<YardLayout />} /> {/* /admin/yardlayout 경로에 해당 */}
          <Route path="/transactions" element={<TransactionPage />} /> {/* /admin/transactions 경로 추가 */}
          <Route path="/settings" element={<Settings />} /> {/* /admin/settings 경로에 해당 */}
          <Route path="/admin/test" element={<TestPage />} />
      </Routes>
    </div>
  );
};

export default Manager;