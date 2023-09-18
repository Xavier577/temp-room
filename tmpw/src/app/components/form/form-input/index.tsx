import {
  ChangeEventHandler,
  FocusEventHandler,
  HTMLInputTypeAttribute,
} from 'react';

export type FormInputProps = {
  value?: string | number | readonly string[];
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: FocusEventHandler<HTMLInputElement>;
  name: string;
  placeholder: string;
  validationErr?: boolean;
  width?: string | number;
  height?: string | number;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
};
export const FormInput = ({
  name,
  value,
  onChange,
  onFocus,
  placeholder,
  validationErr = false,
  width = 'full',
  height = '70px',
  type = 'text',
  required = false,
}: FormInputProps) => {
  return (
    <input
      className={`
                  w-${width}
                  h-[${height}] 
                  px-2 
                  bg-transparent 
                  border 
                  border-solid 
                  text-[#AAE980] 
                  ${
                    validationErr
                      ? 'border-red-400 hover:border-red-400 focus:border-red-500'
                      : 'border-[#56644C] hover:border-[#AAE980] focus:border-[#AAE980]'
                  } 
                  focus:outline-none 
                  placeholder-[rgba(201,248,169,0.67)]
                  `}
      name={name}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      required={required}
    />
  );
};
