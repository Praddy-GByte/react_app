
// Import necessary React dependencies.
import React from 'react';

const SensorCard = ({ sensorName, enabled, wsPort }) => {
    return (
        <div className={`sensor-card ${enabled ? 'enabled' : 'disabled'}`}>
            <h2>{sensorName}</h2>
            <p>ws_port: {wsPort}</p>
        </div>
    );
};

export default SensorCard;
