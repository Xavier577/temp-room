import useAppStore from '@app/store';
import { useRouter } from 'next/navigation';
import { useError } from '@app/hooks/use-error';
import { useEffect, useState } from 'react';
import tempRoom from '@app/services/temp-room';
import { User } from '@app/store/states';
import { AxiosError } from 'axios';
import { SIGN_IN_PATH } from '@app/const';

export function useUser() {
  const user = useAppStore((state) => state.user);
  const [isFetchComplete, setIsFetchComplete] = useState(false);
  const setUser = useAppStore((state) => state.setUser);
  const getAccessToken = useAppStore((state) => state.getAccessToken);
  const accessToken = getAccessToken();

  const router = useRouter();

  const [error, setError] = useError<'UNAUTHORIZED' | 'INTERNAL'>();

  useEffect(() => {
    tempRoom
      .fetchUserProfile<User>(accessToken)
      .then((userData) => {
        setUser(
          new User({
            id: userData.id,
            email: userData.email,
            username: userData.username,
          }),
        );
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            setError({ code: 'UNAUTHORIZED', msg: err.response?.data });
            router.push(SIGN_IN_PATH);
          }
        } else {
          setError({ code: 'INTERNAL', msg: 'something went wrong' });
        }
      })
      .finally(() => {
        setIsFetchComplete(true);
      });
  }, []);

  return { user, isFetchComplete, accessToken, error } as const;
}
