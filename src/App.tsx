import React, { useState, useEffect } from 'react';
import { Timer, RefreshCw, Save, Upload, Play, Trash2 } from 'lucide-react';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { DifficultySelector } from './components/DifficultySelector';
import { generatePuzzle, solveSudoku, validateBoard } from './utils/sudoku';
import type { BoardType, Difficulty } from './types';

function App() {
  const [board, setBoard] = useState<BoardType>(Array(9).fill(Array(9).fill(0)));
  const [solving, setSolving] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleCellChange = (row: number, col: number, value: number) => {
    const newBoard = board.map((r, i) =>
      i === row ? r.map((c: number, j: number) => (j === col ? value : c)) : r
    );
    setBoard(newBoard);
    setError(validateBoard(newBoard) ? null : 'Invalid move');
  };

  const handleSolve = async () => {
    if (!validateBoard(board)) {
      setError('Invalid board configuration');
      return;
    }
    setSolving(true);
    setIsRunning(true);
    const solution = await solveSudoku(board, (newBoard) => {
      setBoard([...newBoard]);
    });
    setSolving(false);
    if (!solution) {
      setError('No solution exists');
    }
  };

  const handleReset = () => {
    setBoard(generatePuzzle(difficulty));
    setTime(0);
    setIsRunning(false);
    setError(null);
  };

  const handleSave = () => {
    const data = JSON.stringify({ board, time, difficulty });
    localStorage.setItem('sudoku-save', data);
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('sudoku-save');
    if (saved) {
      const { board: savedBoard, time: savedTime, difficulty: savedDifficulty } = JSON.parse(saved);
      setBoard(savedBoard);
      setTime(savedTime);
      setDifficulty(savedDifficulty);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Sudoku Solver
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Fill in the numbers or generate a new puzzle to solve
          </p>
          
          <div className="mb-6">
            <DifficultySelector
              difficulty={difficulty}
              onChange={setDifficulty}
              disabled={solving}
            />
          </div>

          <div className="relative">
            <Board
              board={board}
              onCellChange={handleCellChange}
              solving={solving}
              error={error}
            />
            
            {error && (
              <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-700 px-4 py-2 rounded-t-lg text-center">
                {error}
              </div>
            )}
          </div>

          <div className="mt-6">
            <Controls
              onSolve={handleSolve}
              onReset={handleReset}
              onSave={handleSave}
              onLoad={handleLoad}
              solving={solving}
              time={time}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;