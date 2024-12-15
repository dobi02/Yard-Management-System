import React, { useState, useEffect } from 'react';
import { Card, Button, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import ManagerLayout from './ManagerLayout';
import './ManagerDashboard.css';
import axios from 'axios';

const { Option } = Select;

const API_BASE_URL = 'http://localhost:8000';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;

const ManagerDashboard = () => {
    const [divisions, setDivisions] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [yards, setYards] = useState([]);
    const [yardsCount, setYardsCount] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const navigate = useNavigate();

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

    const handleDivisionChange = async (divisionId) => {
        setSelectedDivision(divisionId);
        try {
            const yardsResponse = await axios.get(`${API_BASE_URL}/places/api/yards/${divisionId}/`);
            const driversResponse = await axios.get(`${API_BASE_URL}/drivers/api/division-drivers/${divisionId}/`);
            setYards(yardsResponse.data);
            setDrivers(driversResponse.data);
            getYardsCount(yardsResponse.data);
        } catch (error) {
            message.error('Failed to load data.');
        }
    };

    const handleAddYard = async () => {
        if (!selectedDivision) {
            message.error('Please select a division first.');
            return;
        }
        try {
            await axios.post(`${API_BASE_URL}/places/api/yards/`, { division_id: selectedDivision });
            message.success('Yard added successfully.');
            handleDivisionChange(selectedDivision);
        } catch (error) {
            message.error('Failed to add yard.');
        }
    };

    const handleDeleteYard = async (yardId) => {
        try {
            await axios.delete(`${API_BASE_URL}/places/api/yards/${yardId}/`);
            message.success('Yard deleted successfully.');
            handleDivisionChange(selectedDivision);
        } catch (error) {
            message.error('Failed to delete yard.');
        }
    };
    const getYardsCount = async (yardds) => {
        try{
            let a = []
            for(let yard of yardds){
                const yardsCountResponse = await axios.get(`${API_BASE_URL}/places/api/yards/${yard.yard_id}/yard_asset_count/`);
                a.push(yardsCountResponse.data);
            }
            setYardsCount(a)
        }catch(error){
            message.error('Failed to get yards.');
        }
    };

    return (
        <ManagerLayout>
            <div className="dashboard-main">
                {/* 좌측: 디비전 선택과 야드 카드 */}
                <div className="yard-section">
                    <div className="select-container">
                        <Select
                            placeholder="Select Division"
                            onChange={handleDivisionChange}
                            value={selectedDivision || undefined}
                            style={{ width: '150px', height: '40px' }}
                        >
                            {divisions.map((division) => (
                                <Option key={division.division_id} value={division.division_id}>
                                    {division.division_id}
                                </Option>
                            ))}
                        </Select>
                        <Button
                            type="default"
                            onClick={handleAddYard}
                            style={{ width: '150px', height: '40px', marginLeft: '10px', marginTop: '0px' }}
                        >
                            Add Yard
                        </Button>
                    </div>
                    <div className="yard-container">
                        {yardsCount.map((yard) => (
                            <Card
                                key={yard.yard_id}
                                title={`Yard: ${yard.yard_id}`}
                                extra={
                                    <Button
                                        danger
                                        onClick={(e) => {
                                            e.stopPropagation(); // 클릭 이벤트가 카드로 전달되지 않도록 방지
                                            handleDeleteYard(yard.yard_id);
                                        }}
                                        style={{ width: '100px' }}
                                    >
                                        Delete
                                    </Button>
                                }
                                onClick={() => navigate(`/manager/yardlayout/${yard.yard_id}`)}
                                hoverable
                                className="yard-card"
                            >
                                <p>Truck Count: {yard.equipment_count.trucks}</p>
                                <p>Chassis Count: {yard.equipment_count.chassis}</p>
                                <p>Trailer Count: {yard.equipment_count.trailers}</p>
                                <p>Container Count: {yard.equipment_count.containers}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 드라이버 리스트 섹션 */}
                <div className="driver-section">
                    {/* 드라이버 수 표시 */}
                    <div className="driver-summary">
                        <div className="summary-item">
                            <h4>Driver List</h4>
                            <p>Number of drivers: {selectedDivision ? drivers.length : ''}</p>
                        </div>
                    </div>

                    {/* 드라이버 카드 리스트 */}
                    <div className="driver-list">
                        {drivers.map((driver) => (
                            <div key={driver.id} className="driver-card">
                                <h4>{driver.user.first_name} {driver.user.last_name}</h4>
                                <p><strong>State:</strong> {driver.state}</p>
                                <p><strong>Phone:</strong> {driver.phone_number}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
};

export default ManagerDashboard;
