// Import necessary dependencies
import React, { useState } from 'react';
import './App.css';
import sensorConfig from './config.json';

// Main functional component
const App = () => {
  // State variables for sensor configuration, connection status, server running status, and WebSocket
  const [sensorConfiguration, setSensorConfiguration] = useState(sensorConfig);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [ws, setWs] = useState(null);

  // Function to handle WebSocket connection
  const handleConnect = () => {
    // Check if WebSocket is not open or the connection state is not WebSocket.OPEN
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      try {
        // Create a new WebSocket instance
        const newWs = new WebSocket('ws://localhost:8080');

        // WebSocket event handlers
        newWs.onopen = () => {
          setConnectionStatus('Connected');
          setIsServerRunning(true);
          console.log('Server connected');
        };

        newWs.onmessage = (event) => {
          // Handle received sensor data
          const receivedSensorData = JSON.parse(event.data);

          setSensorConfiguration((prevConfig) => {
            const isSensorEnabled = prevConfig[receivedSensorData.sensorName]?.enabled;

            if (isSensorEnabled) {
              // Update sensor configuration if sensor is enabled
              return {
                ...prevConfig,
                [receivedSensorData.sensorName]: {
                  ...prevConfig[receivedSensorData.sensorName],
                  ...receivedSensorData,
                },
              };
            }

            return prevConfig;
          });
        };

        newWs.onclose = () => {
          // Handle WebSocket connection close
          setConnectionStatus('Disconnected');
          setIsServerRunning(false);
          console.log('Server disconnected');
        };

        // Set the new WebSocket instance
        setWs(newWs);
      } catch (error) {
        // Handle connection error
        console.error('Error connecting to the server:', error.message);
        setConnectionStatus('Connection Error');
      }
    }
  };

  // Function to handle WebSocket disconnection
  const handleDisconnect = () => {
    if (ws) {
      ws.onclose = null;
      ws.close();
      setConnectionStatus('Disconnected');
      setIsServerRunning(false);
      console.log('Server disconnected');
    }
  };

  // Function to handle sensor click and open details
  const handleSensorClick = (sensorName) => {
    setSensorConfiguration((prevConfig) => ({
      ...prevConfig,
      [sensorName]: {
        ...prevConfig[sensorName],
        isDetailsOpen: true,
      },
    }));
    console.log(`Opened details for sensor ${sensorName}`);
  };

  // Function to handle sensor toggle (enable/disable)
  const handleSensorToggle = (sensorName) => {
    setSensorConfiguration((prevConfig) => {
      const updatedConfig = { ...prevConfig };
      const sensorData = updatedConfig[sensorName];

      sensorData.enabled = !sensorData.enabled;

      if (!sensorData.enabled) {
        sensorData.lastGeneratedValue = sensorData.value;
      }

      console.log(`${sensorName} ${sensorData.enabled ? 'enabled' : 'disabled'}`);

      return updatedConfig;
    });
  };

  // Render the main application UI
  return (
    <div className="app-container">
      {/* Header section */}
      <header>
        <img src="planys_logo.png" alt="Company Logo" className="company-logo" />
      </header>

      {/* Main content section */}
      <div className="main-content">
        {/* Sensors section */}
        <div className="sensors">
          {Object.entries(sensorConfiguration).map(([sensorName, sensorData]) => (
            <div
              key={sensorName}
              onClick={() => handleSensorClick(sensorName)}
              className={`sensor-card ${sensorData.isDetailsOpen ? 'selected' : ''}`}
            >
              <h2>{sensorName}</h2>
              {/* Sensor toggle section */}
              <div className="sensor-toggle">
                <label>
                  Enable/Disable Sensor
                  <input
                    type="checkbox"
                    checked={sensorData.enabled}
                    onChange={() => handleSensorToggle(sensorName)}
                  />
                </label>
              </div>
              {/* Sensor details section */}
              {sensorData.isDetailsOpen && (
                <div className="sensor-details">
                  <p>ws port: {sensorData.ws_port}</p>
                  <p>{`Value: ${sensorData.value}`}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Button container section */}
      <div className="button-container">
        {/* Connection status section */}
        <div className="connection-status">
          <p>
            Connection Status: {connectionStatus} {isServerRunning ? '' : ''}
          </p>
        </div>
        {/* Connection buttons section */}
        <div className="connection-buttons">
          {/* Connect button */}
          <button onClick={handleConnect} disabled={connectionStatus === 'Connected'}>
            Connect
          </button>
          {/* Disconnect button */}
          <button onClick={handleDisconnect} disabled={connectionStatus === 'Disconnected'}>
            Disconnect
          </button>
        </div>
      </div>

      {/* Compass container section */}
      <div className="compass-container">
        <img src="compass.png" alt="Compass" className="compass" />
      </div>
    </div>
  );
};

// Export the component as the default export
export default App;
