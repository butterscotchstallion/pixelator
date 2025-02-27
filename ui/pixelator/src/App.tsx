import useWebSocket, {ReadyState} from 'react-use-websocket';
import Board from "./components/board/board.tsx";
import {useEffect, useState} from "react";

function App() {
    const socketUrl = 'ws://localhost:8080/ws/game';
    const {sendMessage, readyState, lastMessage} = useWebSocket(socketUrl, {
        shouldReconnect: () => true,
    });
    const [messageHistory, setMessageHistory] = useState<MessageEvent<any> []>();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(() => {
        if (lastMessage !== null) {
            const decoded_message = JSON.parse(lastMessage.data);
            if (decoded_message?.message_type === "GAME_STARTED") {
                setSessionId(decoded_message.data.session_id);
            }
            setMessageHistory((prev) => prev?.concat(lastMessage));
        }
    }, [lastMessage]);

    return (
        <div className="bg-gray-900 text-slate-100 w-screen h-screen">
            <div className="flex justify-between bg-black text-sky-400 p-4">
                <div>
                    {sessionId ? <span>Session ID: {sessionId}</span> : ''}
                </div>
                <div className="justify-end">Connection status: {connectionStatus}</div>
            </div>

            <div className="w-full flex justify-between">
                <Board
                    sendMessage={sendMessage}
                    sessionId={sessionId}
                    lastMessage={lastMessage}/>

                <aside className="w-[200px] h-[500px] flex justify-end m-4 bg-slate-700 overflow-scroll text-sky-500">
                    {lastMessage ? lastMessage.data : null}
                    <ul>
                        {messageHistory?.map((message, idx) => (
                            <span key={idx}>{message ? message.data : null}</span>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    )
}

export default App
