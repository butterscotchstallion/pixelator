import useWebSocket, {ReadyState} from 'react-use-websocket';
import Board from "./components/board/board.tsx";
import {useEffect, useState} from "react";

function App() {
    const socketUrl = 'ws://localhost:8080/ws/game';
    const {sendMessage, readyState, lastMessage} = useWebSocket(socketUrl, {
        shouldReconnect: () => true,
    });
    const [messageHistory, setMessageHistory] = useState<MessageEvent<any> []>();
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev?.concat(lastMessage));
        }
    }, [lastMessage]);

    return (
        <div className="bg-gray-900 text-slate-100 w-screen h-screen p-4">
            <div className="flex justify-end">{connectionStatus}</div>

            <div className="w-full flex justify-between">
                <Board sendMessage={sendMessage}/>

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
