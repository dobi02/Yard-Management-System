import React from 'react';
import { Modal, Form, Select, Input, Button, message } from 'antd';

const { Option } = Select;

const AssetModal = ({ type, visible, onCancel, onFinish, siteList }) => {
    const [form] = Form.useForm();
    const [equipmentType, setEquipmentType] = React.useState(null);

    const renderDynamicFields = () => {
        switch (equipmentType) {
            case 'chassis':
                return (
                    <Form.Item
                        name="chassisType"
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
                            name="containerSize"
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
                            name="containerType"
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
                        name="trailerSize"
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
            form.resetFields();
        } catch (error) {
            message.error('Failed to process the request.');
        }
    };

    return (
        <Modal
            title={type === 'add' ? 'Add Equipment' : 'Delete Equipment'}
            visible={visible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="equipmentType"
                    label="Equipment Type"
                    rules={[{ required: true, message: 'Please select an equipment type!' }]}
                >
                    <Select
                        placeholder="Select equipment type"
                        onChange={(value) => setEquipmentType(value)}
                    >
                        <Option value="truck">Truck</Option>
                        <Option value="chassis">Chassis</Option>
                        <Option value="container">Container</Option>
                        <Option value="trailer">Trailer</Option>
                    </Select>
                </Form.Item>

                {renderDynamicFields()}

                <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, message: 'Please enter the quantity!' }]}
                >
                    <Input type="number" placeholder="Enter quantity" min={1} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        {type === 'add' ? 'Add Equipment' : 'Delete Equipment'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AssetModal;
