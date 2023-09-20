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
  backgroundColor?: string;
  borderColor?: string;
  borderHoverColor?: string;
  borderFocusColor?: string;
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
  backgroundColor = 'transparent',
  borderColor = '#56644C',
  borderHoverColor = '#AAE980',
  borderFocusColor = '#AAE980',
  required = false,
}: FormInputProps) => {
  return (
    <input
      className={`
                  w-${width}
                  h-[${height}] 
                  px-2 
                  bg-${backgroundColor}
                  border 
                  border-solid 
                  text-[#AAE980] 
                  ${
                    validationErr
                      ? 'border-red-400 hover:border-red-400 focus:border-red-500'
                      : `border-[${borderColor}] hover:border-[${borderHoverColor}] focus:border-[${borderFocusColor}]`
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
