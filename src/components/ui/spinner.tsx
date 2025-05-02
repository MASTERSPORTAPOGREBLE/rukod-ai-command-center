
import React from 'react';

export interface SpinnerProps {
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ className = "" }) => {
  return (
    <div className={`animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full ${className}`} role="status" aria-label="Загрузка">
      <span className="sr-only">Загрузка...</span>
    </div>
  );
}
