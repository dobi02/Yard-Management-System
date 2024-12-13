import React, { useState, useEffect } from 'react';
import { Card, Button, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import ManagerLayout from './ManagerLayout';
import './ManagerDashboard.css';
import axios from 'axios';

const { Option } = Select;

const API_BASE_URL = 'http://localhost:8000';

const ManagerDashboard = () => {
    const [divisions, setDivisions] = useState([]); // 디비전 목록
    const [selectedDivision, setSelectedDivision] = useState(null); // 선택된 디비전
    const [yards, setYards] = useState([]); // 현재 디비전의 야드 목록
    const navigate = useNavigate();

    // 디비전 목록 가져오기
    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/places/api/divisions/`);
                setDivisions(response.data);
            } catch (error) {
                message.error('Failed to load divisions.');
            }
        };
        fetchDivisions();
    }, []);

    // 디비전 선택 시 야드 목록 가져오기
    const handleDivisionChange = async (divisionId) => {
        setSelectedDivision(divisionId);
        try {
            const response = await axios.get(`${API_BASE_URL}/places/api/yards/${divisionId}/`);
            const yardsWithCounts = await Promise.all(
                response.data.map(async (yard) => {
                    try {
                        const countResponse = await axios.get(`${API_BASE_URL}/places/api/yards/${yard.yard_id}/equipment-count/`);
                        return { ...yard, equipment_count: countResponse.data.equipment_count };
                    } catch {
                        return { ...yard, equipment_count: { trucks: 0, chassis: 0, trailers: 0, containers: 0 } };
                    }
                })
            );
            setYards(yardsWithCounts);
        } catch (error) {
            message.error('Failed to load yards.');
        }
    };

    // 야드 추가 버튼 클릭 처리
    const handleAddYard = async () => {
        if (!selectedDivision) {
            message.error('Please select a division first.');
            return;
        }
        try {
            await axios.post(`${API_BASE_URL}/places/api/yards/`, { division_id: selectedDivision });
            message.success('Yard added successfully.');
            handleDivisionChange(selectedDivision); // 목록 갱신
        } catch (error) {
            message.error('Failed to add yard.');
        }
    };

    // 야드 삭제 버튼 클릭 처리
    const handleDeleteYard = async (yardId) => {
        try {
            await axios.delete(`${API_BASE_URL}/places/api/yards/${yardId}/`);
            message.success('Yard deleted successfully.');
            handleDivisionChange(selectedDivision); // 목록 갱신
        } catch (error) {
            message.error('Failed to delete yard.');
        }
    };

    return (
        <ManagerLayout>
            <div className="select-container">
                <Select
                    placeholder="Select Division"
                    onChange={handleDivisionChange}
                    value={selectedDivision || undefined}
                    style={{ width: '150px', height: '40px' }} // 높이 통일
                >
                    {divisions.map((division) => (
                        <Option key={division.division_id} value={division.division_id}>
                            {division.division_id}
                        </Option>
                    ))}
                </Select>
                <Button
                    type="primary"
                    onClick={handleAddYard}
                    style={{ width: '150px', height: '40px', marginLeft: '10px' }} // 높이 통일, 간격 추가
                >
                    Add Yard
                </Button>
            </div>
            <div className="yard-container">
                {yards.map((yard) => (
                    <Card
                        key={yard.yard_id}
                        title={`Yard: ${yard.yard_id}`}
                        extra={
                            <Button
                                danger
                                onClick={() => handleDeleteYard(yard.yard_id)}
                                style={{ width: '100px' }}
                            >
                                Delete
                            </Button>
                        }
                        onClick={() => navigate(`/manager/yardlayout/${yard.yard_id}`)}
                        hoverable
                        className="yard-card"
                    >
                        <p>Truck Count: {yard.truck_count}</p>
                        <p>Chassis Count: {yard.chassis_count}</p>
                        <p>Trailer Count: {yard.trailer_count}</p>
                        <p>Container Count: {yard.container_count}</p>
                    </Card>
                ))}
            </div>
        </ManagerLayout>
    );
};

export default ManagerDashboard;
