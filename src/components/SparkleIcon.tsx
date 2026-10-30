import React from 'react';

interface SparkleIconProps {
  className?: string;
  size?: number;
}

export const SparkleIcon: React.FC<SparkleIconProps> = ({
  className = '',
  size = 20,
}) => {
  return (
    <svg
      className={`select-none opacity-40 hover:opacity-75 transition-opacity ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#64748b"
      id="splash-sparkle-icon"
      aria-hidden="true"
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
};
