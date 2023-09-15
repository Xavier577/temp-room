'use client';

import useForm from '@hooks/use-form';
import useAppStore from '@store/index';
import tempRoom from '@services/temp-room';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formValue, handleChange] = useForm({ identifier: '', password: '' });

  const updateAccessToken = useAppStore((state) => state.updateAccessToken);

  const router = useRouter();

  return (
    <main className={'h-screen bg-white text-black'}>
      <h1>Login</h1>

      <form
        method={'POST'}
        onSubmit={(e) => {
          e.preventDefault();

          tempRoom
            .login({
              mode: 'username',
              username: formValue.identifier,
              password: formValue.password,
            })
            .then((result) => {
              // store token
              updateAccessToken(result.token);

              // go to homepage
              router.push('/');
            })
            .catch((error) => console.error(error));
        }}
      >
        <input
          name={'identifier'}
          placeholder={'Username/Email'}
          type={'text'}
          value={formValue.identifier}
          onChange={handleChange}
        />
        <input
          name={'password'}
          placeholder={'Password'}
          type={'password'}
          value={formValue.password}
          onChange={handleChange}
        />

        <button type={'submit'} className={'border border-black p-2'}>
          Login
        </button>
      </form>
    </main>
  );
}
