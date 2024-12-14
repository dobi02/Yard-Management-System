import React from 'react';
import { Button } from 'antd';

const EquipmentActions = ({ modals, setModals, isDisabled }) => {
    return (
        <>
            <Button
                type="primary"
                onClick={() => setModals({ ...modals, add: true })}
                disabled={isDisabled}
                style={{ width: '150px', marginLeft: '10px' }} // Select와 동일한 크기
            >
                Add Equipment
            </Button>
        </>
    );
};

export default EquipmentActions;
