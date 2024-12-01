import React from 'react'
import DriverLayout from "./DriverLayout";

const DriverStatus = () => {
    return (
        <DriverLayout>
            <h2>Status</h2>
            <p> 드라이버 현재 운행 중인 주문 정보 출발, 도착, 경유? 등등 </p>
            <p> 현재 상황 업데이트 버튼 (출발, 진행중, 잠시 멈춤?가능? 완료) </p>
        </DriverLayout>
    );
};

export default DriverStatus;