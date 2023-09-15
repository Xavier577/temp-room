'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAppStore from '@store/index';
import { User } from '@store/states';
import tempRoom from '@services/temp-room';
import { AxiosError } from 'axios';

export default function Home() {
  const router = useRouter();

  const user = useAppStore((state) => state.user);

  const getAccessToken = useAppStore((state) => state.getAccessToken);

  const accessToken = getAccessToken();

  const setUser = useAppStore((state) => state.setUser);

  const [fetchErr, setFetchErr] = useState(false);

  useEffect(() => {
    tempRoom
      .fetchUserProfile(accessToken)
      .then((result) => {
        setUser(
          new User({
            id: result.id,
            email: result.email,
            username: result.email,
          }),
        );
      })
      .catch((err) => {
        setFetchErr(true);

        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            router.push('/auth/login');
          }
        }
      });
  }, [accessToken, router, setUser]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user != null ? (
        <div className={'h-[500px] bg-white flex flex-row gap-10  p-10'}>
          <button
            className={'p-2 text-black bg-gray-400  h-max'}
            onClick={() => router.push('/room/create')}
          >
            Create Room
          </button>
          <button
            className={'p-2 text-black bg-gray-300 h-max'}
            onClick={() => router.push('/room')}
          >
            Join Room
          </button>
        </div>
      ) : fetchErr ? (
        <p>something went wrong</p>
      ) : null}
    </main>
  );
}
