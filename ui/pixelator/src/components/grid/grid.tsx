export default function Grid(props) {
    const blocks = getGrid();

    function getGrid() {
        const blocks = [];
        for (let i = 0; i < 75; i++) {
            blocks.push(
                <div key={i}
                     className="flex flex-grow min-w-[100px] min-h-[100px] bg-sky-200 border-dashed border-1 border-black"></div>
            );
        }
        return blocks;
    }

    return (
        <div className="flex flex-wrap">
            {blocks}
        </div>
    );
}