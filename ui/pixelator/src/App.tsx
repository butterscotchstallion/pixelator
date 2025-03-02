import useWebSocket, {ReadyState} from 'react-use-websocket';
import Board from "./components/board/board.tsx";
import {RefObject, useEffect, useRef, useState} from "react";
import {useParams} from "react-router";
import {ThemeProvider} from "@/components/ui/themeProvider.tsx";
import {Button} from "@/components/ui/button.tsx";
import {toast, Toaster} from "sonner";

function App() {
    const socketUrl = 'ws://localhost:8001/ws/game';
    const {sendMessage, readyState, lastMessage} = useWebSocket(socketUrl, {
        shouldReconnect: () => true,
    });
    const [messageHistory, setMessageHistory] = useState<MessageEvent<any> []>();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const {gameSessionId} = useParams();
    const connectionStatus: string = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Connected',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    const player: RefObject<string> = useRef<string>("X");

    function copyGameLink() {
        const port = window.location.port;
        const gameLink = "http://localhost:" + port + "/game/" + sessionId;
        navigator.clipboard.writeText(gameLink).then(_ => {
            console.log("Game link copied to clipboard: " + gameLink);
            toast("Game link copied.")
        });
    }

    useEffect(() => {
        // Multiplayer situation
        if (gameSessionId) {
            setSessionId(gameSessionId);
            console.log("Game session ID: " + gameSessionId);
            player.current = "O";
            console.log("Set player to " + player.current);
        }

        if (lastMessage !== null) {
            const decoded_message = JSON.parse(lastMessage.data);
            if (!gameSessionId && decoded_message?.message_type === "GAME_STARTED") {
                setSessionId(decoded_message.data.session_id);
            }
            setMessageHistory((prev) => prev?.concat(lastMessage));
        }
    }, [gameSessionId, lastMessage]);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="bg-gray-900 text-slate-100 w-screen h-screen">
                <div className="flex justify-between bg-black text-sky-400 p-4">
                    <div>
                        <div className="flex gap-10">
                            <div>{sessionId ? <span>Session ID: {sessionId}</span> : ''}</div>
                            <Button
                                onClick={() => copyGameLink()}
                                variant="secondary">Copy game link</Button>
                        </div>
                    </div>
                    <div className="justify-end">Connection status: {connectionStatus}</div>
                </div>

                <div className="w-full flex justify-between p-4">
                    <Board
                        sendMessage={sendMessage}
                        sessionId={sessionId}
                        lastMessage={lastMessage}
                        player={player.current}
                    />

                    <aside className="w-[200px] h-[500px] flex justify-end bg-slate-700 overflow-scroll text-sky-500">
                        {lastMessage ? lastMessage.data : null}
                        <ul>
                            {messageHistory?.map((message, idx) => (
                                <span key={idx}>{message ? message.data : null}</span>
                            ))}
                        </ul>
                    </aside>
                </div>
            </div>
            <Toaster position="top-right"/>
        </ThemeProvider>
    )
}

export default App
