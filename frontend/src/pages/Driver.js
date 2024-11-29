import React from 'react';
import {Routes, Route, Outlet, Navigate} from 'react-router-dom';
import DriverDashboard from "../components/Driver/DriverDashboard";

const Driver = () => {
      return (
    <div>
      <Outlet /> {/* 자식 라우트가 렌더링되는 위치 */}

      <Routes>
          <Route path="/" element={<Navigate to="/driver/dashboard" replace />} />
          <Route path="/dashboard" element={<DriverDashboard />} /> {/* /driver/dashboard 경로에 해당 */}

      </Routes>
    </div>
  );
};

export default Driver;