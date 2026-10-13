import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverGlow?: boolean;
  className?: string;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverGlow = false,
  bordered = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-[#0e141d] rounded-2xl ${
        bordered ? 'border border-[#1f2d3d]' : ''
      } ${
        hoverGlow
          ? 'transition-all duration-300 hover:border-[#a3e635]/40 hover:shadow-[0_0_25px_-5px_rgba(163,230,53,0.15)] hover:bg-[#121924]'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
