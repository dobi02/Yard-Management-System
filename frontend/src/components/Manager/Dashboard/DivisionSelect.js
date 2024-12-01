import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const DivisionSelect = ({ divisions, onChange }) => {
    return (
        <Select
            placeholder="Select Division"
            style={{ width: 150, marginRight: 10 }}
            onChange={onChange}
        >
            {divisions.map((division) => (
                <Option key={division.division_id} value={division.division_id}>
                    {division.division_id}
                </Option>
            ))}
        </Select>
    );
};

export default DivisionSelect;
