import Show from '@app/components/icons/show';
import Hide from '@app/components/icons/hide';
import {
  ChangeEventHandler,
  FocusEventHandler,
  JSX,
  ReactNode,
  useState,
} from 'react';

export type PasswordFormInputProps = {
  value?: string | number | readonly string[];
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: FocusEventHandler<HTMLInputElement>;
  name: string;
  placeholder: string;
  showPasswordIcon?: JSX.Element | ReactNode;
  hidePasswordIcon?: JSX.Element | ReactNode;
  validationErr?: boolean;
  width?: string | number;
  height?: string | number;
  required?: boolean;
};

export const PasswordFormInput = ({
  name,
  value,
  onChange,
  onFocus,
  placeholder,
  showPasswordIcon = <Show />,
  hidePasswordIcon = <Hide />,
  validationErr = false,
  width = 'full',
  height = '70px',
  required = false,
}: PasswordFormInputProps) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`
                    flex
                    items-center
                    justify-between
                    w-[${width}] 
                    h-[${height}] 
                    bg-transparent 
                    border 
                    border-solid 
                    text-[#AAE980] 
                    ${
                      validationErr
                        ? 'border-red-400 hover:border-red-400 focus:border-red-500'
                        : isFocused
                        ? 'border-[#AAE980] hover:border-[#AAE980]'
                        : 'border-[#56644C] hover:border-[#AAE980]'
                    } 
                    focus:outline-none 
              `}
    >
      <input
        className={`
                  w-[90%]
                  h-full 
                  px-2 
                  bg-transparent 
                  border 
                  border-solid 
                  border-r-0
                  border-transparent
                  text-[#AAE980] 
                  text-sm
                  focus:outline-none 
                  placeholder-[rgba(201,248,169,0.67)] 
                  `}
        name={name}
        placeholder={placeholder}
        type={hidePassword ? 'password' : 'text'}
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          onFocus(e);
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        required={required}
      />

      <span
        className={'mr-[3%]'}
        onClick={() => {
          setHidePassword((currentState) => !currentState);
        }}
      >
        {hidePassword ? showPasswordIcon : hidePasswordIcon}
      </span>
    </div>
  );
};
