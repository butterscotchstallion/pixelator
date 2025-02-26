import {useState} from "react";
import './board.scss';

export default function Board() {
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

    function playMove(index: number) {
        if (boardInfo[index] || isGameOver) {
            return;
        }
        boardInfo[index] = player;
        setBoardInfo(boardInfo);
        setPlayer(player === "X" ? "O" : "X");

        const isGameOverCheck: boolean = getGameOver();
        if (isGameOverCheck) {
            setGameOver(true);
            setWinningPlayer(getWinningPlayer());
        }
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

    return (
        <>
            <div>{isGameOver && !isStalemate ? 'Game over! ' + winningPlayer + ' won!' : ''}</div>
            <div>{isStalemate ? 'Stalemate!' : ''}</div>
            <div className="w-[300px] h-[300px] justify-center flex flex-wrap">
                {cells}
            </div>
            <button onClick={() => reset()}>Reset</button>
        </>
    )
}