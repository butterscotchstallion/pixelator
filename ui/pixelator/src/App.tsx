import useWebSocket from 'react-use-websocket';
import {useState} from "react";
import Canvas from "./components/canvas/canvas.tsx";

function App() {
    const socketUrl = 'ws://localhost:8080/echo';
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    useWebSocket(socketUrl, {
        onOpen: () => {
            setConnectionStatus("Connected");
        },
        shouldReconnect: () => true,
    });

    return (
        <div className="bg-gray-900 text-slate-100 w-screen h-screen p-4">
            <div className="flex justify-end">{connectionStatus}</div>
            <Canvas className="bg-white w-1/2 h-1/2 border-solid border-4 border-gray-800"/>
        </div>
    )
}

export default App
