import React from "react";
import { Card } from 'antd-mobile';
import { EnvironmentOutline } from "antd-mobile-icons";

const DriverTransactionCard = ({ order: transaction }) => {

    return (
            <Card className="transaction-card">
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
                        <span className="list-item-icon">📏</span>
                        <span className="list-item-key">Distance Left:</span>
                        <span className="list-item-text">(임시)10 km</span>
                    </div>
                </Card>
    );
};

export default DriverTransactionCard;

