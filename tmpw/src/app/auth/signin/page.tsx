'use client';

import useForm, { DataCollectionElement } from '@app/hooks/use-form';
import useAppStore from '@app/store/index';
import tempRoom from '@app/services/temp-room';
import { useRouter } from 'next/navigation';
import AppLogo from '@app/components/icons/app-logo';
import UserIcon from '@app/components/icons/user-icon';
import Link from 'next/link';
import { signFormValidator } from '@app/auth/signin/validators/signin-form.validator';
import { SignInMode } from '@app/enums/sigin-mode';
import { ChangeEventHandler, FormEvent, useState } from 'react';
import Hide from '@app/components/icons/hide';
import Show from '@app/components/icons/show';
import { AxiosError } from 'axios';

export default function SignIn() {
  const [formValue, handleChange] = useForm({ identifier: '', password: '' });

  const updateAccessToken = useAppStore((state) => state.updateAccessToken);

  const router = useRouter();

  const [validationError, setValidationError] = useState<any>(undefined);

  const [showPassword, setShowPassword] = useState(false);

  const [loginError, setLoginError] = useState<any>(undefined);

  const onChangeHandler: ChangeEventHandler<DataCollectionElement> = (
    event,
  ) => {
    handleChange(event);
    setValidationError(undefined);
    setLoginError(undefined);
  };

  const submitForm = (e: FormEvent) => {
    e.preventDefault();

    let signInMode: SignInMode = SignInMode.USERNAME;

    const IS_TYPING_EMAIL = /@/gi.test(formValue.identifier);

    if (IS_TYPING_EMAIL) {
      signInMode = SignInMode.EMAIL;
    }

    const data = {
      mode: signInMode,
      identifier: formValue.identifier,
      password: formValue.password,
    };

    const validationResult = signFormValidator.validate(data);

    const validationErrors: any = {};

    if (validationResult.error != null) {
      for (const errDetails of validationResult.error.details) {
        if (errDetails.context?.key != null) {
          validationErrors[errDetails.context?.key] = {
            message: errDetails.context?.label,
          };
        }
      }

      setValidationError(validationErrors);
    } else {
      tempRoom
        .login({
          mode: signInMode,
          username: formValue.identifier,
          password: formValue.password,
        })
        .then((result) => {
          // store token
          updateAccessToken(result.token);

          // go to homepage
          router.push('/');
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            if (error.response?.status === 400) {
              setLoginError({
                message: error.response.data,
              });
            }
          }
        });
    }
  };

  return (
    <main className="flex flex-col h-screen bg-[#110F0F]">
      <header className={'flex flex-row justify-between p-10 w-full'}>
        <AppLogo />
        <UserIcon />
      </header>

      <section
        className={'flex flex-col items-center justify-center w-full h-full'}
      >
        <div
          className={`
          w-[55%] 
          min-w-[370px] 
          max-w-[730px]
          h-[55%] 
          bg-[#110F0F] 
          flex 
          flex-col 
          items-center 
          border 
          border-solid 
          border-[#110F0F] 
          drop-shadow-md
          `}
        >
          <div>
            <h1 className={'text-[#C9F8A9] text-[32px] font-sans'}>Sign in</h1>
          </div>

          <form
            className={`
                flex 
                flex-col 
                w-[80%] 
                h-[70%] 
                items-center 
                justify-center 
                gap-[35px]
                `}
            method={'POST'}
            onSubmit={submitForm}
          >
            <div className={'w-[80%] h-max flex flex-col'}>
              {loginError != null ? (
                <span className={'text-red-400 py-3'}>
                  {loginError.message}
                </span>
              ) : null}

              <input
                className={`
                  w-full 
                  h-[70px] 
                  px-2 
                  bg-transparent 
                  border 
                  border-solid 
                  text-[#AAE980] 
                  ${
                    validationError?.identifier
                      ? 'border-red-400 hover:border-red-400 focus:border-red-500'
                      : 'border-[#56644C] hover:border-[#AAE980] focus:border-[#AAE980]'
                  } 
                  focus:outline-none 
                  placeholder-[rgba(201,248,169,0.67)]
                  `}
                name={'identifier'}
                placeholder={'Username/Email'}
                type={'text'}
                value={formValue.identifier}
                onChange={onChangeHandler}
                onFocus={() => {
                  setLoginError(undefined);
                }}
              />
              {validationError?.identifier != null ? (
                <p className={'text-red-400'}>
                  {validationError.identifier.message}
                </p>
              ) : null}
            </div>

            <div className={'w-[80%] h-max flex flex-col'}>
              <div
                tabIndex={0}
                className={`
                    flex
                    items-center
                    justify-between
                    w-full 
                    h-[70px] 
                    bg-transparent 
                    border 
                    border-solid 
                    text-[#AAE980] 
                    ${
                      validationError?.password
                        ? 'border-red-400 hover:border-red-400 focus:border-red-500'
                        : 'border-[#56644C] hover:border-[#AAE980] focus:border-[#AAE980]'
                    } 
                    focus:outline-none 
              `}
              >
                <input
                  className={`
                  w-[90%]
                  h-[70px] 
                  px-2 
                  bg-transparent 
                  border 
                  border-solid 
                  border-r-0
                  border-transparent
                  text-[#AAE980] 
                  focus:outline-none 
                  placeholder-[rgba(201,248,169,0.67)] 
                  `}
                  name={'password'}
                  placeholder={'Password'}
                  type={showPassword ? 'text' : 'password'}
                  value={formValue.password}
                  onChange={onChangeHandler}
                  onFocus={() => {
                    setLoginError(undefined);
                  }}
                />

                <span
                  className={'mr-[2%]'}
                  onClick={() => {
                    setShowPassword((currentState) => !currentState);
                  }}
                >
                  {showPassword ? <Hide /> : <Show />}
                </span>
              </div>

              {validationError?.password != null ? (
                <p className={'text-red-400'}>
                  {validationError.password.message}
                </p>
              ) : null}
            </div>

            <div className={'flex flex-row w-[80%]  justify-between items-end'}>
              <p>
                {"Don't have an account?"}{' '}
                <Link
                  href={'/auth/signup'}
                  className={'text-[#C9F8A9] font-[16px]'}
                >
                  Sign up
                </Link>
              </p>

              <button
                className={
                  'w-[100px] h-[50px] bg-[#C9F8A9] text-[14px] text-[#110F0F]'
                }
                type={'submit'}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
