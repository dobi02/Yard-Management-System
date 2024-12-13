import React from 'react';
import { Card } from 'antd';
import './InfoCards.css';

// 각 필요한 정보들 변수로 넣음
const InfoCards = ({ sites }) => {
    return (
        <div className="info-cards-section">
            {/* 사이트 카드 */}
            {sites.length > 0 && (
                <>
                    <h2>Sites</h2>
                    <div className="info-cards-container">
                        {sites.map((site) => (
                            <Card
                                key={site.site_id}
                                title={`Site ID: ${site.site_id}`}
                                style={{ width: 300 }}
                                hoverable
                            >
                                <p><strong>Yard ID:</strong> {site.yard_id}</p>
                                <p><strong>Asset Type:</strong> {site.asset_type}</p>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {/* 그 외의 표시할 카드 컴포넌트 제작 */}
            
        </div>
    );
};

export default InfoCards;