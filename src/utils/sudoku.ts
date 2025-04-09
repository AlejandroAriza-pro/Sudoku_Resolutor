import type { BoardType, Difficulty } from '../types';

const DELAY = 50; // ms delay for visualization

export const validateBoard = (board: BoardType): boolean => {
  // Check rows
  for (let row = 0; row < 9; row++) {
    const seen = new Set();
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value !== 0) {
        if (seen.has(value)) return false;
        seen.add(value);
      }
    }
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const seen = new Set();
    for (let row = 0; row < 9; row++) {
      const value = board[row][col];
      if (value !== 0) {
        if (seen.has(value)) return false;
        seen.add(value);
      }
    }
  }

  // Check 3x3 boxes
  for (let box = 0; box < 9; box++) {
    const seen = new Set();
    const rowStart = Math.floor(box / 3) * 3;
    const colStart = (box % 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const value = board[rowStart + i][colStart + j];
        if (value !== 0) {
          if (seen.has(value)) return false;
          seen.add(value);
        }
      }
    }
  }

  return true;
};

const isValid = (board: BoardType, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

const findEmpty = (board: BoardType): [number, number] | null => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) return [i, j];
    }
  }
  return null;
};

export const solveSudoku = async (
  board: BoardType,
  onUpdate: (board: BoardType) => void
): Promise<boolean> => {
  const empty = findEmpty(board);
  if (!empty) return true;

  const [row, col] = empty;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      onUpdate([...board]);
      await new Promise((resolve) => setTimeout(resolve, DELAY));

      if (await solveSudoku(board, onUpdate)) {
        return true;
      }

      board[row][col] = 0;
      onUpdate([...board]);
      await new Promise((resolve) => setTimeout(resolve, DELAY));
    }
  }

  return false;
};

const getDifficultyConfig = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy': return 35;
    case 'medium': return 30;
    case 'hard': return 25;
    case 'expert': return 20;
    default: return 30;
  }
};

export const generatePuzzle = (difficulty: Difficulty): BoardType => {
  // Create empty board
  const board: BoardType = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill diagonal boxes first (they are independent)
  for (let box = 0; box < 9; box += 3) {
    fillBox(board, box, box);
  }
  
  // Solve the rest of the board
  solveSudokuForGeneration(board);
  
  // Remove numbers based on difficulty
  const cellsToKeep = getDifficultyConfig(difficulty);
  const totalCells = 81;
  const cellsToRemove = totalCells - cellsToKeep;
  
  let count = 0;
  while (count < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      count++;
    }
  }
  
  return board;
};

const fillBox = (board: BoardType, row: number, col: number): void => {
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let index = 0;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[row + i][col + j] = nums[index];
      index++;
    }
  }
};

const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const solveSudokuForGeneration = (board: BoardType): boolean => {
  const empty = findEmpty(board);
  if (!empty) return true;

  const [row, col] = empty;
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const num of nums) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudokuForGeneration(board)) {
        return true;
      }
      board[row][col] = 0;
    }
  }

  return false;
};