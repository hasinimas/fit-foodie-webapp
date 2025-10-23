import React from 'react';
interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  action?: React.ReactNode;
}
const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  action
}) => {
  return<div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${className}`}>
      {title && <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
<h3 className="font-medium text-gray-800 dark:text-gray-200">{title}</h3>
          {action && <div>{action}</div>}
        </div>}
      <div className="p-5">{children}</div>
    </div>;
};
export default Card;