import React from 'react';
import { Play, RefreshCw, Save, Upload, Timer } from 'lucide-react';

interface ControlsProps {
  onSolve: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  solving: boolean;
  time: number;
}

export const Controls: React.FC<ControlsProps> = ({
  onSolve,
  onReset,
  onSave,
  onLoad,
  solving,
  time,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onSolve}
          disabled={solving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={20} />
          {solving ? 'Solving...' : 'Solve'}
        </button>
        <button
          onClick={onReset}
          disabled={solving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={20} />
          Reset
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Timer size={20} />
          <span className="font-mono">{formatTime(time)}</span>
        </div>
        
        <button
          onClick={onSave}
          disabled={solving}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          Save
        </button>
        <button
          onClick={onLoad}
          disabled={solving}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={20} />
          Load
        </button>
      </div>
    </div>
  );
};