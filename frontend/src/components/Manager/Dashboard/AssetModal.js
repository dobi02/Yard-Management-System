import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, Button, message } from 'antd';

const { Option } = Select;

const AssetModal = ({ type, visible, onCancel, onFinish, siteList, yardAssets, equipmentType }) => {
    const [form] = Form.useForm();
    const [equipmentOptions, setEquipmentOptions] = useState([]);
    const [selectedEquipmentType, setSelectedEquipmentType] = React.useState(null);

    const resetForm = () => {
      form.resetFields();
      setSelectedEquipmentType(null); // 장비 유형 상태 초기화
    };

    // 장비 선택 옵션 업데이트 (삭제 모드에서 사용)
    useEffect(() => {
        if (type === 'delete' && yardAssets && equipmentType) {
            // 야드 데이터에서 특정 장비 유형만 필터링하여 옵션 설정
            setEquipmentOptions(yardAssets[equipmentType] || []);
        }
    }, [type, yardAssets, equipmentType]);

    const renderDynamicFields = () => {
        if (type === 'delete') {
            // 삭제 모드: 장비 선택 필드만 렌더링
            return (
                <Form.Item
                    name="equipmentId"
                    label="Select Equipment to Delete"
                    rules={[{ required: true, message: 'Please select an equipment ID to delete!' }]}
                >
                    <Select
                        placeholder="Select equipment"
                        showSearch
                        optionFilterProp="children"
                    >
                        {equipmentOptions.map((item) => (
                            <Option key={item.id || item.truck_id} value={item.id || item.truck_id}>
                                {item.id || item.truck_id} ({item.type})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            );
        }

        // 추가 모드: 장비 유형 및 세부 필드 렌더링
        switch (selectedEquipmentType) {
            case 'truck':
                return (
                    <Form.Item
                        name="type"
                        label="Truck Type"
                        rules={[{ required: true, message: 'Please select a Truck type!' }]}
                    >
                        <Select placeholder="Select truck type">
                            <Option value="TA">TA</Option>
                            <Option value="TB">TB</Option>
                        </Select>
                    </Form.Item>
                );
            case 'chassis':
                return (
                    <Form.Item
                        name="type"
                        label="Chassis Type"
                        rules={[{ required: true, message: 'Please select a chassis type!' }]}
                    >
                        <Select placeholder="Select chassis type">
                            <Option value="regular">Regular</Option>
                            <Option value="light">Light</Option>
                            <Option value="tandem">Tandem</Option>
                            <Option value="triAxle">Tri Axle</Option>
                        </Select>
                    </Form.Item>
                );
            case 'container':
                return (
                    <>
                        <Form.Item
                            name="size"
                            label="Container Size"
                            rules={[{ required: true, message: 'Please select a container size!' }]}
                        >
                            <Select placeholder="Select container size">
                                <Option value="20ST">20ST</Option>
                                <Option value="40HC">40HC</Option>
                                <Option value="40ST">40ST</Option>
                                <Option value="45HC">45HC</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="type"
                            label="Container Type"
                            rules={[{ required: true, message: 'Please select a container type!' }]}
                        >
                            <Select placeholder="Select container type">
                                <Option value="dry">Dry</Option>
                                <Option value="reefer">Reefer</Option>
                                <Option value="flatRack">Flat Rack</Option>
                                <Option value="isoTank">ISO Tank</Option>
                                <Option value="openTop">Open Top</Option>
                            </Select>
                        </Form.Item>
                    </>
                );
            case 'trailer':
                return (
                    <Form.Item
                        name="size"
                        label="Trailer Size"
                        rules={[{ required: true, message: 'Please select a trailer size!' }]}
                    >
                        <Select placeholder="Select trailer size">
                            <Option value="53ft">53'</Option>
                            <Option value="48ft">48'</Option>
                        </Select>
                    </Form.Item>
                );
            default:
                return null;
        }
    };

    const handleSubmit = async (values) => {
        try {
            await onFinish(values);
            resetForm();
        } catch (error) {
            message.error('Failed to process the request.');
        }
    };

    return (
        <Modal
            title={type === 'add' ? 'Add Equipment' : 'Delete Equipment'}
            visible={visible}
            onCancel={() => {
                resetForm();
                onCancel();
            }}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {type === 'add' && (
                    <Form.Item
                        name="equipmentType"
                        label="Equipment Type"
                        rules={[{ required: true, message: 'Please select an equipment type!' }]}
                    >
                        <Select
                            placeholder="Select equipment type"
                            onChange={(value) => setSelectedEquipmentType(value)}
                        >
                            <Option value="truck">Truck</Option>
                            <Option value="chassis">Chassis</Option>
                            <Option value="container">Container</Option>
                            <Option value="trailer">Trailer</Option>
                        </Select>
                    </Form.Item>
                )}

                {renderDynamicFields()}

                {type === 'add' && (
                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{ required: true, message: 'Please enter the quantity!' }]}
                    >
                        <Input type="number" placeholder="Enter quantity" min={1} />
                    </Form.Item>
                )}

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* **[추가] Reset 버튼** */}
                        <Button onClick={resetForm} style={{ width: '48%' }}>
                            Reset
                        </Button>
                        <Button type="primary" htmlType="submit" style={{ width: '48%' }}>
                            {type === 'add' ? 'Add Equipment' : 'Delete Equipment'}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AssetModal;
