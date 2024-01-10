import React, { useEffect, useState } from 'react';

const WebSocketComponent = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Create a WebSocket connection when the component mounts.
        const newSocket = new WebSocket('ws://localhost:6111'); // Change the URL and port to match your WebSocket server.

        newSocket.addEventListener('open', () => {
            console.log('WebSocket connection established');
            setSocket(newSocket);
        });

        newSocket.addEventListener('close', () => {
            console.log('WebSocket connection closed');
            setSocket(null);
        });

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    return null; // This component doesn't render anything in the UI.
};

export default WebSocketComponent;
