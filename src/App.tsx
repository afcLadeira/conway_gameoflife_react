import { useCallback, useEffect, useRef, useState } from "react";
import GameBoard from "./components/board";

const boardSize: number = 35; //   100x100

const timeoutDelay: number = 1000;

const initialBoardValue: number[][] = new Array(boardSize).fill(
  new Array(boardSize).fill(0)
);

const NEIGHBOURS: number[][] = [
  [-1, -1],
  [0, -1],
  [1, -1], //top
  [-1, 0],
  [1, 0], //sides
  [-1, 1],
  [0, 1],
  [1, 1], //borttom
];

const equal = (a: any, b: any): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

const sleep = (): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, 5000));

const countAdjacentNeighboursAlive = (
  currentBoard: number[][],
  x: number,
  y: number
) => {
  // console.log("Checking cell : [x,y]", `[${x},${y}] `)

  let currentBoardTemp: number[][] = currentBoard.slice(0);

  if (!currentBoardTemp) return 0;
  let neighboursAlive: number = 0;

  NEIGHBOURS.forEach((positions: any) => {
    // console.log("Neighbour : [x,y]", `[${x+positions[0]},${y+positions[1]}] `)

    //edge cases
    if (x + positions[0] === -1 || x + positions[0] === boardSize) return 0;
    else if (y + positions[1] === -1 || y + positions[1] === boardSize)
      return 0;
    //----
    else if (currentBoardTemp[y + positions[1]]![x + positions[0]] === 1) {
      neighboursAlive++;
    } else return 0;
  });

  return neighboursAlive;
};

const App = () => {
  const [seconds, setSeconds] = useState(0);
  const [bSize, setBdSize] = useState(boardSize);
  const [currentBoard, setCurrentBoard] = useState(initialBoardValue);
  const [testBoard, setTestBoard] = useState<any | null>(initialBoardValue);
  const [isSelecting, setIsSelecting] = useState(false);

  let intervalId = useRef<ReturnType<typeof setInterval> | undefined>();

  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearTimeout(intervalId.current);
      }
    };
  }, []);

  let currentB = useRef(currentBoard);
  currentB.current = currentBoard;

  const calculateNextBoard = useCallback(() => {
    let hasChanged = false;

    setTestBoard(JSON.parse(JSON.stringify(currentB.current)));

    //this array will have the new values
    //we have to do this way because while testing the rules we can not immediatly change the value of the current array or other cells will be evaluated wrong
    let oldArraywithNewValues = JSON.parse(JSON.stringify(currentB.current));

    let currentBoardTemp = currentB.current.slice(0);

    currentBoardTemp.forEach((row: any, y: number, array: any) => {
      row.forEach((alive: any, x: number, array2: any) => {
        let count: number = countAdjacentNeighboursAlive(array, x, y);

        if (alive === 1 && count != 2 && count != 3) {
          //dies

          oldArraywithNewValues[y] = [...oldArraywithNewValues[y]];
          oldArraywithNewValues[y][x] = 0;
          //array[y][x] = 0;
          hasChanged = true;
        } else if (alive === 0 && count === 3) {
          //is born

          oldArraywithNewValues[y] = [...oldArraywithNewValues[y]];
          oldArraywithNewValues[y][x] = 1;
          //array[y][x] = 1;
          hasChanged = true;
        }
      });
    });

    if (!hasChanged) clearTimeout(intervalId.current);
    else {
      setCurrentBoard(oldArraywithNewValues);
      setSeconds((prev) => prev + 1);
      intervalId.current = setTimeout(() => {
        calculateNextBoard();
      }, timeoutDelay);
    }
  }, [currentBoard]);

  const stopCurrentTimer = () => {
    clearTimeout(intervalId.current);
  };

  const changeCellValue = (vector: [number, number]) => {
    let newBoard = currentBoard.slice(0);

    newBoard[vector[1]] = [...(newBoard[vector[1] as number] as number[])];

    let oldValue = newBoard[vector[1]]![vector[0]];

    newBoard[vector[1]]![vector[0]] = oldValue === 0 ? 1 : 0;

    setCurrentBoard(newBoard);
  };

  const reset = () => {
    setCurrentBoard(initialBoardValue);
    setTestBoard(initialBoardValue);
    setSeconds(0);
    clearTimeout(intervalId.current);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-6xl font-normal leading-normal mt-0 mb-2 text-green-800">
        Conway's Game of Life
      </h1>
      <div className="flex flex-wrap justify-around p-5">
        <div>
          <button
            className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => calculateNextBoard()}
          >
            Run Simulation
          </button>

          <button
            className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => stopCurrentTimer()}
          >
            Pause Simulation
          </button>
          <button
            className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
        <div className="p-2">
          <h5>Rules:</h5>
          <p>Any live cell with two or three live neighbours survives.</p>
          <p>Any dead cell with three live neighbours becomes a live cell.</p>
          <p>
            All other live cells die in the next generation. Similarly, all
            other dead cells stay dead.
          </p>
        </div>
      </div>
      <h6 className="text-center text-xl font-normal leading-normal mt-0 mb-2 text-blue-900">
        Generation: {seconds}
      </h6>

      <div className="flex flex-row gap-10 justify-center flex-wrap-reverse">
        <div style={{ overflowY: "scroll" }} className="opacity-40">
          Previous Board
          {testBoard && (
            <GameBoard
              changeCellValue={changeCellValue}
              currentBoard={testBoard}
              isSelecting={isSelecting}
              setIsSelecting={setIsSelecting}
            ></GameBoard>
          )}
        </div>
        <div style={{ overflowY: "scroll" }}>
          Current Board
          <GameBoard
            changeCellValue={changeCellValue}
            currentBoard={currentBoard}
            isSelecting={isSelecting}
            setIsSelecting={setIsSelecting}
          ></GameBoard>
        </div>
      </div>
    </div>
  );
};

export default App;
