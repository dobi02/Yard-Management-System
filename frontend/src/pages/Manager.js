import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import ManagerDashboard from '../components/Manager/ManagerDashboard';
import YardLayout from '../components/Manager/YardLayout';
import Settings from "../components/Auth/Setting";
import TransactionPage from "../components/Manager/TransactionPage";

const Manager = () => {
    return (
        <div>
            <Outlet /> {/* 자식 라우트가 렌더링되는 위치 */}

            <Routes>
                <Route path="/" element={<Navigate to="/manager/dashboard" replace />} />
                <Route path="/dashboard" element={<ManagerDashboard />} /> {/* 디비전 관리자 대시보드 */}
                <Route path="/yardlayout/:yardId" element={<YardLayout />} /> {/* 선택된 야드 레이아웃 */}
                <Route path="/transactions" element={<TransactionPage />} /> {/* In/Out 트랜잭션 페이지 */}
                <Route path="/settings" element={<Settings />} /> {/* 설정 페이지 */}
            </Routes>
        </div>
    );
};

export default Manager;
