import React, { useState, useEffect } from 'react';
import { Button, message, Form } from 'antd';
import ManagerLayout from './ManagerLayout';
import DivisionSelect from "./Dashboard/DivisionSelect";
import YardSelect from './Dashboard/YardSelect';
import InfoCards from './Dashboard/InfoCards';
import AssetModal from './Dashboard/AssetModal';
import EquipmentActions from './Dashboard/EquipmentActions';
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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 모달 상태
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 모달 상태
    const [modals, setModals] = useState({ add: false, delete: false });
    const [form] = Form.useForm(); // 폼 인스턴스

    // 디비전 목록 불러오기
    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/places/api/divisions/`);
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
            const response = await axios.get(`${API_BASE_URL}/places/api/yards/${divisionId}/`);
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
            const response = await axios.get(`${API_BASE_URL}/places/api/sites/${yardId}/`);
            setSites(response.data);
        } catch (error) {
            message.error('Failed to load sites');
        }
    };

    // 장비 추가 처리
   const handleAddEquipment = async (values) => {
    const { equipmentType, type, quantity, size } = values;

    // 장비별 API 엔드포인트 매핑
    const apiEndpoints = {
        truck: '/api/trucks/',
        chassis: '/api/chassis/',
        trailer: '/api/trailers/',
        container: '/api/containers/',
    };

    const endpoint = apiEndpoints[equipmentType];
    if (!endpoint) {
        message.error('Invalid equipment type.');
        return;
    }

    try {
        const payload = {
            yard: selectedYard,
            type,
            quantity,
            ...(equipmentType === 'container' && { size }), // 컨테이너에만 사이즈 포함
        };
        await axios.post(`${API_BASE_URL}${endpoint}`, payload);
        message.success(`${equipmentType.toUpperCase()} added successfully.`);
        setIsAddModalOpen(false);
        form.resetFields();
    } catch (error) {
        message.error(`Failed to add ${equipmentType}.`);
        console.error(error);
    }
};

    // 장비 삭제 처리
    const handleDeleteEquipment = async (equipmentId, equipmentType) => {
    // 장비별 API 엔드포인트 매핑
    const apiEndpoints = {
        truck: '/api/trucks/',
        chassis: '/api/chassis/',
        trailer: '/api/trailers/',
        container: '/api/containers/',
    };

    const endpoint = apiEndpoints[equipmentType];
    if (!endpoint) {
        message.error('Invalid equipment type.');
        return;
    }

    try {
        await axios.delete(`${API_BASE_URL}${endpoint}${equipmentId}/`);
        message.success(`${equipmentType.toUpperCase()} deleted successfully.`);
        setIsDeleteModalOpen(false);
    } catch (error) {
        message.error(`Failed to delete ${equipmentType}.`);
        console.error(error);
    }
};


    return (
        <ManagerLayout>
            <div className="select-container">
                {/* 디비전 선택 */}
                <DivisionSelect divisions={divisions} onChange={handleDivisionChange} />
                {/* 야드 선택 */}
                <YardSelect yards={yards} onChange={handleYardChange} />
                <EquipmentActions
                    modals={modals}
                    setModals={setModals}
                    isDisabled={!selectedYard}
                />
            </div>

            {/* 사이트 카드 */}
            <InfoCards sites={sites} />

            {/* 장비 추가 모달 */}
            <AssetModal
                type="add"
                visible={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                onFinish={handleAddEquipment}
            />

            {/* 장비 삭제 모달 */}
            <AssetModal
                type="delete"
                visible={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onFinish={(values) => handleDeleteEquipment(values.equipmentId, values.equipmentType)}
            />
        </ManagerLayout>
    );
};

export default ManagerDashboard;
