import React from 'react';
interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'emerald' | 'blue' | 'amber';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  color = 'emerald',
  showLabel = true,
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min(Math.max(value / max * 100, 0), 100);
  const colorClasses = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500'
  };
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  return <div className={className}>
      <div className="flex justify-between items-center mb-1">
        {showLabel && <>
            <span className="text-sm text-gray-500">
              {value} / {max}
            </span>
            <span className="text-sm text-gray-500">
              {percentage.toFixed(0)}%
            </span>
          </>}
      </div>
      <div className={`w-full bg-gray-200 rounded-full ${heightClasses[size]}`}>
        <div className={`${colorClasses[color]} rounded-full ${heightClasses[size]}`} style={{
        width: `${percentage}%`
      }} />
      </div>
    </div>;
};
export default ProgressBar;