import React from 'react';
import { Card } from 'antd';

const InfoCards = ({ sites }) => {
    return (
        <div className="cards-container" style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {sites.length > 0 ? (
                sites.map((site) => (
                    <Card
                        key={site.site_id}
                        title={`Site ID: ${site.site_id}`}
                        style={{ width: 300 }}
                        hoverable
                    >
                        <p><strong>Yard ID:</strong> {site.yard_id}</p>
                        <p><strong>Asset Type:</strong> {site.asset_type}</p>
                    </Card>
                ))
            ) : (
                <p>No site available</p>
            )}
        </div>
    );
};

export default InfoCards;
