import React from 'react';
import {Routes, Route, Outlet, Navigate, useParams} from 'react-router-dom';
import DriverDashboard from "../components/Driver/DriverDashboard";
import DriverTransaction from "../components/Driver/DriverTransaction";
import DriverSettings from "../components/Driver/DriverSettings";

const Driver = () => {
    const username = useParams();
      return (
    <div>
      <Outlet /> {/* 자식 라우트가 렌더링되는 위치 */}

      <Routes>
          <Route path="/" element={<Navigate to={`/driver/${username.username}/dashboard`} replace />} />
          {/* 하단 탭 */}
          <Route path="/dashboard/" element={<DriverDashboard />} />
          <Route path="/transaction/" element={<DriverTransaction />} />
          <Route path="/settings" element={<DriverSettings />} />
      </Routes>
    </div>
  );
};

export default Driver;