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
import { FormInput } from '@app/components/form/form-input';
import { PasswordFormInput } from '@app/components/form/password-input';

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
          min-w-[570px] 
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
                min-h-[300px]
                items-center 
                justify-center 
                gap-[35px]
                `}
            method={'POST'}
            onSubmit={submitForm}
          >
            {loginError != null ? (
              <span className={'text-red-400 translate-y-[8px]'}>
                {loginError.message}
              </span>
            ) : null}
            <div className={'w-[80%] h-max flex flex-col'}>
              <FormInput
                name={'identifier'}
                placeholder={'Username/Email'}
                type={'text'}
                value={formValue.identifier}
                onChange={onChangeHandler}
                onFocus={() => {
                  setLoginError(undefined);
                }}
                validationErr={validationError?.identifier != null}
              />

              {validationError?.identifier != null ? (
                <p className={'text-red-400'}>
                  {validationError.identifier.message}
                </p>
              ) : null}
            </div>

            <div className={'w-[80%] h-max flex flex-col'}>
              <PasswordFormInput
                name={'password'}
                placeholder={'Password'}
                value={formValue.password}
                onChange={onChangeHandler}
                onFocus={() => {
                  setLoginError(undefined);
                }}
                validationErr={validationError?.password != null}
              />

              {validationError?.password != null ? (
                <p className={'text-red-400'}>
                  {validationError.password.message}
                </p>
              ) : null}
            </div>

            <div className={'flex flex-row w-[80%]  justify-between items-end'}>
              <p>
                <span className={'text-[#696B68] font-[16px] font-sans'}>
                  {"Don't have an account?"}{' '}
                </span>
                <Link
                  href={'/auth/signup'}
                  className={'text-[#C9F8A9] font-[16px] font-sans'}
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
