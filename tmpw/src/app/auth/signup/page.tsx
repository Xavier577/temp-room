'use client';

import useForm, { DataCollectionElement } from '@app/hooks/use-form';
import useAppStore from '@app/store/index';
import { useRouter } from 'next/navigation';
import AppLogo from '@app/components/icons/app-logo';
import UserIcon from '@app/components/icons/user-icon';
import Link from 'next/link';
import { ChangeEventHandler, FormEvent, useState } from 'react';
import { Button } from '@app/components/button';
import { FormInput } from '@app/components/form/form-input';
import { PasswordFormInput } from '@app/components/form/password-input';
import { signupFormValidator } from '@app/auth/signup/validators/signup-form.validator';
import tempRoom, { SignupPayload } from '@app/services/temp-room';
import { AxiosError } from 'axios';

export type SignUpFields = {
  firstName?: string;
  lastName?: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp() {
  const [formValue, handleChange] = useForm<SignUpFields>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const updateAccessToken = useAppStore((state) => state.updateAccessToken);

  const router = useRouter();

  const [validationError, setValidationError] = useState<any>(undefined);

  const [signUpErr, setSignUpErr] = useState<any>(undefined);

  const onChangeHandler: ChangeEventHandler<DataCollectionElement> = (
    event,
  ) => {
    handleChange(event);
    setValidationError(undefined);
    setSignUpErr(undefined);
  };

  const submitForm = (e: FormEvent) => {
    e.preventDefault();

    const validationResult = signupFormValidator.validate(formValue);

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
      const signUpPayload: SignupPayload = {
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        password: formValue.password,
        username: formValue.username,
      };

      tempRoom
        .signUp(signUpPayload)
        .then((result) => {
          // store token
          updateAccessToken(result.token);
          // go to homepage
          router.push('/');
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            if (error.response?.status === 400) {
              setSignUpErr({
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
        <Link href={'/'}>
          <AppLogo />
        </Link>
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
          h-[75%] 
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
            <h1 className={'text-[#C9F8A9] text-[32px] font-sans'}>Sign Up</h1>
          </div>

          <form
            className={`
                flex 
                flex-col 
                w-[80%] 
                h-[90%]
                min-h-[500px] 
                items-center 
                justify-center 
                gap-[35px]
                `}
            method={'POST'}
            onSubmit={submitForm}
          >
            {signUpErr != null ? (
              <span className={'text-red-400 translate-y-[8px]'}>
                {signUpErr.message}
              </span>
            ) : null}
            <div className={'w-[80%] h-max flex flex-row justify-between'}>
              <div className={'w-[47.5%] h-max flex flex-col'}>
                <FormInput
                  name={'firstName'}
                  placeholder={'Firstname (optional)'}
                  value={formValue.firstName}
                  type={'text'}
                  onChange={onChangeHandler}
                  onFocus={() => {
                    setSignUpErr(undefined);
                  }}
                />

                {validationError?.firstName != null ? (
                  <p className={'text-red-400'}>
                    {validationError.firstName.message}
                  </p>
                ) : null}
              </div>

              <div className={'w-[47.5%] h-max flex flex-col'}>
                <FormInput
                  name={'lastName'}
                  placeholder={'Lastname (optional)'}
                  value={formValue.lastName}
                  type={'text'}
                  onChange={onChangeHandler}
                  onFocus={() => {
                    setSignUpErr(undefined);
                  }}
                />

                {validationError?.lastName != null ? (
                  <p className={'text-red-400'}>
                    {validationError.lastName.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className={'w-[80%] h-max flex flex-col'}>
              <FormInput
                name={'email'}
                placeholder={'Email'}
                value={formValue.email}
                type={'email'}
                onChange={onChangeHandler}
                onFocus={() => {
                  setSignUpErr(undefined);
                }}
                validationErr={validationError?.email != null}
              />

              {validationError?.email != null ? (
                <p className={'text-red-400'}>
                  {validationError.email.message}
                </p>
              ) : null}
            </div>

            <div className={'w-[80%] h-max flex flex-col'}>
              <FormInput
                name={'username'}
                placeholder={'Username'}
                value={formValue.username}
                type={'text'}
                onChange={onChangeHandler}
                onFocus={() => {
                  setSignUpErr(undefined);
                }}
                validationErr={validationError?.username != null}
              />

              {validationError?.username != null ? (
                <p className={'text-red-400'}>
                  {validationError.username.message}
                </p>
              ) : null}
            </div>

            <div className={'w-[80%] h-max flex flex-row justify-between'}>
              <div className={'w-[47.5%] h-max flex flex-col'}>
                <PasswordFormInput
                  width={'full'}
                  name={'password'}
                  placeholder={'Password'}
                  value={formValue.password}
                  onChange={onChangeHandler}
                  onFocus={() => {
                    setSignUpErr(undefined);
                  }}
                  validationErr={validationError?.password != null}
                />

                {validationError?.password != null ? (
                  <p className={'text-red-400'}>
                    {validationError.password.message}
                  </p>
                ) : null}
              </div>

              <div className={'w-[47.5%] h-max flex flex-col'}>
                <PasswordFormInput
                  width={'full'}
                  name={'confirmPassword'}
                  placeholder={'Confirm Password'}
                  value={formValue.confirmPassword}
                  onChange={onChangeHandler}
                  onFocus={() => {
                    setSignUpErr(undefined);
                  }}
                  validationErr={validationError?.confirmPassword != null}
                />

                {validationError?.confirmPassword != null ? (
                  <p className={'text-red-400'}>
                    {validationError.confirmPassword.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className={'flex flex-row w-[80%] justify-between items-end'}>
              <p>
                <span className={'text-[#696B68] font-[16px] font-sans'}>
                  {'Have an account already?'}{' '}
                </span>
                <Link
                  href={'/auth/signin'}
                  className={'text-[#C9F8A9] font-[16px]'}
                >
                  Sign in
                </Link>
              </p>

              <Button text={'Sign up'} type={'submit'} />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
