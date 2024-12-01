import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const YardSelect = ({ yards, onChange, disabled }) => {
    return (
        <Select
            placeholder="Select Yard"
            style={{ width: 150 }}
            onChange={onChange}
            disabled={disabled}
        >
            {yards.map((yard) => (
                <Option key={yard.yard_id} value={yard.yard_id}>
                    {yard.yard_id}
                </Option>
            ))}
        </Select>
    );
};

export default YardSelect;
