import React from 'react';
import type { BoardType } from '../types';

interface BoardProps {
  board: BoardType;
  onCellChange: (row: number, col: number, value: number) => void;
  solving: boolean;
  error: string | null;
}

export const Board: React.FC<BoardProps> = ({ board, onCellChange, solving, error }) => {
  const handleInput = (row: number, col: number, value: string) => {
    const num = value === '' ? 0 : parseInt(value.slice(-1), 10);
    if ((num >= 0 && num <= 9) || value === '') {
      onCellChange(row, col, num);
    }
  };

  return (
    <div className="grid grid-cols-9 gap-[1px] bg-gray-300 p-[1px] rounded-lg">
      {board.map((row, i) =>
        row.map((cell: number, j: number) => (
          <div
            key={`${i}-${j}`}
            className={`
              relative aspect-square
              ${i % 3 === 0 && 'border-t-2 border-gray-400'}
              ${j % 3 === 0 && 'border-l-2 border-gray-400'}
              ${i === 8 && 'border-b-2 border-gray-400'}
              ${j === 8 && 'border-r-2 border-gray-400'}
              ${error ? 'bg-red-50' : 'bg-white'}
              ${solving ? 'transition-colors duration-300' : ''}
            `}
          >
            <input
              type="text"
              value={cell === 0 ? '' : cell.toString()}
              onChange={(e) => handleInput(i, j, e.target.value)}
              disabled={solving}
              className={`
                w-full h-full text-center text-xl font-semibold
                disabled:bg-transparent focus:outline-none
                ${cell === 0 ? 'text-blue-600' : 'text-gray-800'}
              `}
              maxLength={1}
            />
          </div>
        ))
      )}
    </div>
  );
};