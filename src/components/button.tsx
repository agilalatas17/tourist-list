import React from 'react';

interface ButtonProps {
  color?: string;
  size?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ color, size, onClick, children, disabled = false }) => {
  const defaultColor = '#214151';
  const buttonStyles: React.CSSProperties = {
    backgroundColor: color || defaultColor,
    padding: size === 'small' ? '5px 10px' : '10px 20px',
    color: '#ffffff',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
  };

  return (
    <button type='button' style={buttonStyles} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
