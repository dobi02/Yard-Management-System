import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import ManagerLayout from './ManagerLayout';
import DivisionSelect from "./Dashboard/DivisionSelect";
import YardSelect from './Dashboard/YardSelect';
import InfoCards from './Dashboard/InfoCards';
//import AssetModal from "./Dashboard/AssetModal";
import './ManagerDashboard.css';
import axios from 'axios';

// 기본 주소
const API_BASE_URL = 'http://localhost:8000';

const ManagerDashboard = () => {

    const [divisions, setDivisions] = useState([]); // 디비전 목록
    const [yards, setYards] = useState([]); // 야드 목록
    const [sites, setSites] = useState([]); // 사이트 목록
    const [selectedDivision, setSelectedDivision] = useState(null); // 선택된 디비전
    const [selectedYard, setSelectedYard] = useState(null); // 선택된 야드
    //const [modals, setModals] = useState({ add: false, delete: false });

    // 디비전 목록 불러오기
    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/places/divisions/`);
                setDivisions(response.data);
            } catch (error) {
                message.error('Failed to load divisions');
            }
        };
        fetchDivisions();
    }, []);

    // 디비전 선택 시 야드 목록 가져오기
    const handleDivisionChange = async (divisionId) => {
        setSelectedDivision(divisionId);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/places/yards/${divisionId}/`);
            setYards(response.data);
            setSelectedYard(null); // 디비전 변경시 야드 초기화
            setSites([]); // 사이트 목록 초기화
        } catch (error) {
            message.error('Failed to load yards');
        }
    };

    // 야드 선택 시 사이트 목록 가져오기
    const handleYardChange = async (yardId) => {
        setSelectedYard(yardId);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/places/sites/${yardId}/`);
            setSites(response.data);
        } catch (error) {
            message.error('Failed to load sites');
        }
    };

    return (
        <ManagerLayout>
            <div className="select-container">
                {/* 디비전 선택 */}
                <DivisionSelect divisions={divisions} onChange={handleDivisionChange} />
                {/* 야드 선택 */}
                <YardSelect yards={yards} onChange={handleYardChange} />
            {/*    <Button onClick={() => setModals({ ...modals, add: true })}>Add Equipment</Button>*/}
            {/*    <Button onClick={() => setModals({ ...modals, delete: true })}>Delete Equipment</Button>*/}
            </div>

            {/* 사이트 카드 */}
            <InfoCards sites={sites} />

        </ManagerLayout>
    );
};

export default ManagerDashboard;
