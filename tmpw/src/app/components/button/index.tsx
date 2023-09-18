import { MouseEventHandler } from 'react';

export type ButtonProps = {
  width?: string | number;
  height?: string | number;
  buttonTextSize?: string;
  buttonTextColor?: string;
  buttonColor?: string;
  text: string;
  type?: 'button' | 'reset' | 'submit';
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
export const Button = ({
  width = '100px',
  height = '50px',
  buttonColor = '#C9F8A9',
  text,
  buttonTextColor = '#110F0F',
  buttonTextSize = '14px',
  type = 'button',
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`w-[${width}] h-[${height}] bg-[${buttonColor}] text-[${buttonTextSize}] text-[${buttonTextColor}]`}
      type={type}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
