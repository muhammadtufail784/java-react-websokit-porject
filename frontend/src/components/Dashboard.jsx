import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState({
        leftValue: 0,
        rightValue: 0,
        timestamp: '--:--:--'
    });
    const [connected, setConnected] = useState(false);
    const stompClientRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);
        
        // Disable verbose logging in console
        stompClient.debug = () => {};

        stompClient.connect({}, (frame) => {
            if (!isMounted) {
                if (stompClient.ws.readyState === SockJS.OPEN) {
                    stompClient.disconnect();
                }
                return;
            }
            setConnected(true);
            stompClient.subscribe('/topic/numbers', (message) => {
                if (isMounted) {
                    const update = JSON.parse(message.body);
                    setData(update);
                }
            });
        }, (error) => {
            if (isMounted) {
                console.error('Connection error: ', error);
                setConnected(false);
            }
        });

        stompClientRef.current = stompClient;

        return () => {
            isMounted = false;
            if (stompClientRef.current) {
                try {
                    // Only disconnect if it's actually connected or connecting
                    if (stompClientRef.current.ws.readyState === SockJS.OPEN || 
                        stompClientRef.current.ws.readyState === SockJS.CONNECTING) {
                        stompClientRef.current.disconnect();
                    }
                } catch (e) {
                    console.log('Cleanup disconnect suppressed:', e.message);
                }
            }
        };
    }, []);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Real-Time Data Dashboard</h1>
                <div className={`status-badge ${connected ? 'status-online' : 'status-offline'}`}>
                    {connected ? 'LIVE' : 'RECONNECTING...'}
                </div>
            </header>

            <main className="dashboard-grid">
                <div className="card left-card">
                    <div className="card-label">Left Sensor</div>
                    <div className="card-value">{data.leftValue.toFixed(2)}</div>
                    <div className="card-trend">Live Feed</div>
                </div>

                <div className="card right-card">
                    <div className="card-label">Right Sensor</div>
                    <div className="card-value">{data.rightValue.toFixed(2)}</div>
                    <div className="card-trend">Live Feed</div>
                </div>
            </main>

            <footer className="dashboard-footer">
                <div className="timestamp">
                    Last Updated: <span>{data.timestamp}</span>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
