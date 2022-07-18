

interface GameBoardProps {
    currentBoard: any[],
    setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>;
    changeCellValue: (vector: [number, number]) => void
    isSelecting: boolean
}

export default function GameBoard({currentBoard , setIsSelecting , changeCellValue , isSelecting } : GameBoardProps) {

return (<div style={{ display: "flex", flexDirection: "column" }}>
        {currentBoard.map((column, yIndex) => {
          return (
            <div key={yIndex} style={{ display: "flex", flexDirection: "row" }}>
              {column.map((squareValue: number, xIndex: number) => {
                return (
                  <div
                    onMouseDown={() => {
                        setIsSelecting(true)
                        changeCellValue([xIndex, yIndex]) }}
                    onMouseUp={() => setIsSelecting(false)}   
                    onMouseEnter={() => {
                        if (isSelecting) {
                            changeCellValue([xIndex, yIndex])
                        }
                    }} 
                    key={xIndex}
                    style={{
                        userSelect:'none',
                      width: 30,
                      height: 30,
                      border: "1px solid black",
                      backgroundColor:
                        squareValue == 1 ? "lightgreen" : "white",
                    }}
                  >
                    {/* <span
                      style={{ fontSize: 10 }}
                    >{`${xIndex},${yIndex}`}</span>
                    {squareValue} */}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>)
}