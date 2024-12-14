import React from "react";
import { Card } from 'antd-mobile';
import {LocationFill, UserOutline} from "antd-mobile-icons";

import '../DriverDashboard.css'


const DriverInfoCard = ({ userInfo }) => {
    console.log(userInfo);

    return (
            <Card>
                <h3>User Info</h3>
                <div className="list-item">
                    <span className="list-item-icon" >
                        <UserOutline />
                    </span>
                    <span className="list-item-key">Name:</span>
                    <span className="list-item-text">{userInfo.fullname}</span>
                </div>


                <div className="list-item">
                    {/*<span className="list-item-icon" style={{ color: "red" }}>*/}
                    {/*    <LocationFill />*/}
                    {/*</span>*/}
                    <span className="list-item-key">State:</span>
                    <span className="list-item-text">{userInfo.state}</span>
                </div>

                </Card>
    );
};

export default DriverInfoCard;

