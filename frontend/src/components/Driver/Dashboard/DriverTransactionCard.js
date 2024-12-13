import React from "react";
import { Card } from 'antd-mobile';
import { EnvironmentOutline } from "antd-mobile-icons";

import '../DriverDashboard.css'


const DriverTransactionCard = ({ transaction }) => {

    const StatusIcon = ({ status }) => {
        const getIcon = () => {
            switch (status) {
                case 'waiting':
                    return '⏳';
                case 'accepted':
                    return '✅';
                case 'moving':
                    return '🚛';
                case 'arrived':
                    return '🏁';
                case 'canceled':
                    return '❌';
                default:
                    return null;
            }
        };

    return <div>{getIcon()}</div>;
};


    return (
            <Card>
                    <h3>Ongoing Trip</h3>
                    <div className="list-item">
                        <span className="list-item-icon">
                            <EnvironmentOutline/>
                        </span>
                        <span className="list-item-key">From:</span>
                        <span className="list-item-text">{transaction.originYard}</span>
                    </div>
                    <div className="list-item">
                        <span className="list-item-icon">
                            <EnvironmentOutline/>
                        </span>
                        <span className="list-item-key">To:</span>
                        <span className="list-item-text">{transaction.destination}</span>
                    </div>
                    <div className="list-item">
                        <StatusIcon className="list-item-icon" status={transaction.status} />
                        <span className="list-item-key">Status:</span>
                        <span className="list-item-text">{transaction.status}</span>
                    </div>
                </Card>
    );
};

export default DriverTransactionCard;

