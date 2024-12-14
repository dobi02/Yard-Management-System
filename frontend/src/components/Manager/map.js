import React, { useEffect, useState } from "react";
import axios from "axios";
import ManagerLayout from "./ManagerLayout";

function ParkingLot() {
  const [slotData, setSlotData] = useState([]);
  const [parkingSlots, setParkingSlots] = useState([]);

  // 데이터 가져오기
  const fetchSlotData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/places/api/yards/LA_01/count/"
      );
      const { site_list, parking_slots } = response.data;

      setSlotData(site_list); // 슬롯 그룹별 데이터 저장
      setParkingSlots(parking_slots); // 실제 슬롯 정보 저장
    } catch (error) {
      console.error("슬롯 데이터를 가져오는 데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    fetchSlotData();
  }, []);

  return (
    <ManagerLayout>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "1000px",
          backgroundColor: "#f5f5f5", // 배경색
        }}
      >
        {slotData.map((site, idx) => {
          const typeSlots = parkingSlots[idx] || []; // 각 타입별 슬롯 데이터
          const slotCount = site.total_slots;

          // Y축 위치 계산 (모든 사이트 간 일정한 세로 간격)
          const topPosition = idx === 0
            ? 100 // 첫 번째 사이트
            : idx === 1 || idx === 2
            ? 300 // 두 번째, 세 번째 사이트
            : 500; // 네 번째 사이트

          // X축 위치 계산 (두 번째와 세 번째 사이트를 가로로 배치)
          const leftPosition = idx === 2
            ? 400 // 세 번째 사이트는 오른쪽으로 이동
            : 150; // 나머지는 기본 X축 위치

          // 열 계산 (2줄 고정)
          const rows = 2;
          const columns = Math.ceil(slotCount / rows);

          return (
            <div
              key={site.asset_type}
              style={{
                position: "absolute",
                top: `${topPosition}px`, // 조정된 Y축 위치
                left: `${leftPosition}px`, // 조정된 X축 위치
                padding: "0px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${columns}, 30px)`, // 슬롯 폭 조정
                  gridAutoRows: "50px", // 고정된 슬롯 높이
                  gap: "0px", // 슬롯 간 간격 제거
                }}
              >
                {typeSlots.map((slot, slotIdx) => (
                  <div
                    key={slot.slot_id}
                    style={{
                      width: "30px",
                      height: "50px",
                      border: "1px solid #ccc", // 슬롯 경계
                      boxSizing: "border-box",
                      backgroundColor: slot.is_occupied ? "#ffcccc" : "#ffffff", // 점유 상태에 따라 색상 변경
                    }}
                  ></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ManagerLayout>
  );
}

export default ParkingLot;
