import {ReactElement, useCallback, useEffect, useState} from "react";
import './board.scss';

interface boardProps {
    sendMessage: (message: string) => void;
    sessionId: string | null;
    lastMessage: MessageEvent<any> | null;
    player: string;
}

interface BoardInfo {
    [index: number]: string;
}

export default function Board(props: boardProps): ReactElement {
    const [boardInfo, setBoardInfo] = useState<BoardInfo[]>([]);
    const [isGameOver, setGameOver] = useState<boolean>(false);
    const [winningPlayer, setWinningPlayer] = useState<string | null>(null);
    const [isStalemate, setStalemate] = useState<boolean>(false);
    const [player, setPlayer] = useState<string>(props.player);
    const updateBoardInfo = useCallback((index: number, player: string)=> {
        setBoardInfo(prevBoard => {
            const newBoard: BoardInfo[] = [...prevBoard];
            newBoard[index] = player;
            return newBoard;
        });
        console.log("Updated boardInfo with index: " + index + " and player: " + player);
    }, []);

    function toIndex(row: number, column: number): number {
        return row * 3 + column;
    }

    function getWinningCells(): number[] | null {
        const wins: string[] = ['012', '345', '678', '036', '147', '258', '048', '246']
        for (const cells of wins) {
            const indices: number[] = cells.split('').map(Number)
            const line: string = indices.map(index => boardInfo[index]).join('')
            if (line === 'XXX' || line === 'OOO') {
                return indices;
            }
        }
        return null
    }

    function getWinningPlayer(): string | null {
        const winningCells: number[] | null = getWinningCells();
        if (winningCells) {
            return boardInfo[winningCells[0]] as string;
        }
        return null;
    }

    function isBoardFull(): boolean {
        return boardInfo.filter(cell => !!cell).length === 9;
    }

    function getGameOver(): boolean {
        const winningCells: number[] | null = getWinningCells();
        const boardFull: boolean = isBoardFull();
        const winner: string | null = getWinningPlayer();
        const ticTacToeObtained: boolean = !!winningCells && winner !== null;
        const stalemate: boolean = boardFull && winner === null;
        setStalemate(stalemate);
        return !stalemate && ticTacToeObtained || boardFull;
    }

    function playMove(index: number) {
        if (boardInfo[index] || isGameOver) {
            return;
        }

        updateBoardInfo(index, props.player);
        sendMove(index, props.player);

        const isGameOverCheck: boolean = getGameOver();
        if (isGameOverCheck) {
            setGameOver(true);
            setWinningPlayer(getWinningPlayer());
        }
    }

    function sendMove(index: number, player: string) {
        props.sendMessage(JSON.stringify({
            message_type: "MOVE",
            data: {
                index: index,
                player: props.player,
                session_id: props.sessionId
            }
        }));
        console.log("Sent MOVE message with sessionId: " + props.sessionId + " and index: " + index + " and player: " + player);
    }

    function reset() {
        setBoardInfo([]);
        setGameOver(false);
        setWinningPlayer(null);
        setStalemate(false);
    }



    useEffect(() => {
        if (!props.sessionId) {
            props.sendMessage(JSON.stringify({
                message_type: "START"
            }));
        }

        setPlayer(props.player);

        if (props.lastMessage) {
            const decoded_message = JSON.parse(props.lastMessage.data);
            switch (decoded_message?.message_type) {
                case "MOVE_SUCCESSFUL":
                    console.log("Received MOVE_SUCCESSFUL message with sessionId: " + props.sessionId);
                    //updateBoardInfo(decoded_message.data.index, decoded_message.data.player);
                    break;
            }
        }

        console.log("Board loaded with sessionId: " + props.sessionId);
    }, [props.sessionId, props.player, props.lastMessage, updateBoardInfo, props]);

    const cells = [];
    for (let row: number = 0; row < 3; row++) {
        for (let cell: number = 0; cell < 3; cell++) {
            cells.push(
                <div
                    onClick={() => playMove(toIndex(row, cell))}
                    key={row + '-' + cell}
                    className={"flex bg-slate-700 cursor-pointer justify-center items-center text-4xl text-bold border-slate-400 border-1 border-solid w-[100px] h-[100px] " + 'cell-' + boardInfo[toIndex(row, cell)]}>
                    {boardInfo[toIndex(row, cell)] as string}
                </div>
            );
        }
    }

    return (
        <>
            <div>
                <div>{isGameOver && !isStalemate ? 'Game over! ' + winningPlayer + ' won!' : ''}</div>
                <div>{isStalemate ? 'Stalemate!' : ''}</div>
                <div className="w-[300px] h-[300px] justify-center flex flex-wrap">
                    {cells}
                </div>
                <div className="flex justify-between">
                    <button onClick={() => reset()}>Reset</button>
                    <div>Playing as <strong>{player}</strong></div>
                </div>
            </div>
        </>
    )
}