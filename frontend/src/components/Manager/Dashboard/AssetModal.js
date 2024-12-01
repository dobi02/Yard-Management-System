import React from 'react';
import { Modal, Form, Select, Input, Button } from 'antd';

const { Option } = Select;

const EquipmentModal = ({
    type,
    visible,
    onCancel,
    onFinish,
    equipmentList = [],
    renderDynamicFields
}) => {
    const [form] = Form.useForm();

    return (
        <Modal
            title={type === 'add' ? 'Add Equipment' : 'Delete Equipment'}
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            {type === 'add' ? (
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="equipmentType"
                        label="Equipment Type"
                        rules={[{ required: true, message: 'Please select an equipment type!' }]}
                    >
                        <Select
                            placeholder="Select equipment type"
                            onChange={(value) => form.setFieldsValue({ equipmentType: value })}
                        >
                            <Option value="truck">Truck</Option>
                            <Option value="chassis">Chassis</Option>
                            <Option value="container">Container</Option>
                            <Option value="trailer">Trailer</Option>
                        </Select>
                    </Form.Item>
                    {renderDynamicFields && renderDynamicFields()}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {type === 'add' ? 'Add' : 'Delete'}
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <Select
                    placeholder="Select Equipment to Delete"
                    style={{ width: '100%', marginBottom: 20 }}
                    onChange={(value) => onFinish(value)}
                >
                    {equipmentList.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.id} ({item.count} Units)
                        </Option>
                    ))}
                </Select>
            )}
        </Modal>
    );
};

export default EquipmentModal;
