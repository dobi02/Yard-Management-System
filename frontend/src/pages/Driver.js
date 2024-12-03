import React from 'react';
import {Routes, Route, Outlet, Navigate} from 'react-router-dom';
import DriverDashboard from "../components/Driver/DriverDashboard";
import DeliveryOrders from "../components/Driver/DeliveryOrders";
import DriverNotifications from "../components/Driver/DriverNotifications";
import DriverMessages from "../components/Driver/DriverMessages";
import DriverStatus from "../components/Driver/DriverStatus";
import DriverSettings from "../components/Driver/DriverSettings";

const Driver = () => {
      return (
    <div>
      <Outlet /> {/* 자식 라우트가 렌더링되는 위치 */}

      <Routes>
          <Route path="/" element={<Navigate to="/driver/dashboard" replace />} />
          {/* 하단 탭 */}
          <Route path="/dashboard/" element={<DriverDashboard />} /> {/* /driver/dashboard 경로에 해당 */}
          <Route path="/order/" element={<DeliveryOrders />} />
          <Route path="/notifications/" element={<DriverNotifications />} />
          <Route path="/status" element={<DriverStatus />} />
          {/* 사이드 바 */}
          <Route path="/settings" element={<DriverSettings />} />
          <Route path="/messages/" element={<DriverMessages />} />
      </Routes>
    </div>
  );
};

export default Driver;