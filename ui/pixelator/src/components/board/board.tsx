import {useEffect, useState} from "react";
import './board.scss';

export default function Board(props) {
    const cells = [];
    const [boardInfo, setBoardInfo] = useState([]);
    const [isGameOver, setGameOver] = useState<boolean>(false);
    const [player, setPlayer] = useState<string>("X");
    const [winningPlayer, setWinningPlayer] = useState<string | null>(null);
    const [isStalemate, setStalemate] = useState<boolean>(false);

    function toIndex(row: number, column: number) {
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

    function getWinningPlayer() {
        const winningCells: number[] | null = getWinningCells();
        if (winningCells) {
            return boardInfo[winningCells[0]]
        }
        return null;
    }

    function isBoardFull() {
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

    function getGameSessionId() {
        props.sendMessage(JSON.stringify({
            message_type: "START"
        }));
    }

    function playMove(index: number) {
        if (boardInfo[index] || isGameOver) {
            return;
        }

        if (!props.sessionId) {
            getGameSessionId();
        }

        updateBoardInfo(index, player);
        sendMove(index, player);

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
                player: player,
                session_id: props.sessionId
            }
        }));
        console.log("Sent MOVE message with sessionId: " + props.sessionId + " and index: " + index + " and player: " + player);
    }

    function updateBoardInfo(index: number, player: string) {
        boardInfo[index] = player;
        setBoardInfo(boardInfo);
        setPlayer(player === "X" ? "O" : "X");
    }

    function reset() {
        setBoardInfo([]);
        setGameOver(false);
        setPlayer("X");
        setWinningPlayer(null);
        setStalemate(false);
    }

    for (let row: number = 0; row < 3; row++) {
        for (let cell: number = 0; cell < 3; cell++) {
            cells.push(
                <div
                    onClick={() => playMove(toIndex(row, cell))}
                    key={row + '-' + cell}
                    className={"flex bg-slate-700 cursor-pointer justify-center items-center text-4xl text-bold border-slate-400 border-1 border-solid w-[100px] h-[100px] " + 'cell-' + boardInfo[toIndex(row, cell)]}>
                    {boardInfo[toIndex(row, cell)]}
                </div>
            );
        }
    }

    useEffect(() => {
        if (props.lastMessage) {
            const decoded_message = JSON.parse(props.lastMessage.data);
            if (decoded_message?.message_type === "MOVE_SUCCESSFUL") {
                updateBoardInfo(decoded_message.data.index, decoded_message.data.player)
            }
        }

        console.log("Board loaded with sessionId: " + props.sessionId);
    });

    return (
        <>
            <div>
                <div>{isGameOver && !isStalemate ? 'Game over! ' + winningPlayer + ' won!' : ''}</div>
                <div>{isStalemate ? 'Stalemate!' : ''}</div>
                <div className="w-[300px] h-[300px] justify-center flex flex-wrap">
                    {cells}
                </div>
                <button onClick={() => reset()}>Reset</button>
            </div>
        </>
    )
}