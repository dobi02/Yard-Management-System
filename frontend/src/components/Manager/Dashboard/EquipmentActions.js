import React from 'react';
import { Button } from 'antd';

const EquipmentActions = ({ modals, setModals, isDisabled }) => {
    return (
        <>
            <Button
                type="primary"
                onClick={() => setModals({ ...modals, add: true })}
                disabled={isDisabled}
                style={{ width: '150px' }} // Select와 동일한 크기
            >
                Add Equipment
            </Button>
            <Button
                type="danger"
                onClick={() => setModals({ ...modals, delete: true })}
                disabled={isDisabled}
                style={{ width: '150px' }} // Select와 동일한 크기
            >
                Delete Equipment
            </Button>
        </>
    );
};

export default EquipmentActions;
