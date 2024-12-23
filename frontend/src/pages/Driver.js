import React from 'react';
import {Routes, Route, Outlet, Navigate} from 'react-router-dom';
import DriverDashboard from "../components/Driver/DriverDashboard";
import DriverTransaction from "../components/Driver/DriverTransaction";
import DriverAccount from "../components/Driver/DriverAccount";

const Driver = () => {
      return (
    <div>
      <Outlet /> {/* 자식 라우트가 렌더링되는 위치 */}

      <Routes>
          <Route path="/" element={<Navigate to={`/driver/dashboard`} replace />} />
          {/* 하단 탭 */}
          <Route path="/dashboard/" element={<DriverDashboard />} />
          <Route path="/transaction/" element={<DriverTransaction />} />
          <Route path="/account" element={<DriverAccount />} />
      </Routes>
    </div>
  );
};

export default Driver;