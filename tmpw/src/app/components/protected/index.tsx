'use client';

import React, { JSX, Fragment, useEffect, useState } from 'react';
import tempRoom from '@app/services/temp-room';
import { User } from '@app/store/states';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import useAppStore from '@app/store';
import { ErrorScreen } from '@app/components/error-screen';

export type ProtectedProps = {
  children: JSX.Element | React.ReactNode;
  authErrorComponent?: JSX.Element;
};

export default function Protected({
  children,
  authErrorComponent = <ErrorScreen />,
}: ProtectedProps) {
  const router = useRouter();

  const getAccessToken = useAppStore((state) => state.getAccessToken);
  const accessToken = getAccessToken();
  const setUser = useAppStore((state) => state.setUser);
  const user = useAppStore((state) => state.user);

  const [fetchErr, setFetchErr] = useState(false);

  useEffect(() => {
    tempRoom
      .fetchUserProfile(accessToken)
      .then((result) => {
        setUser?.(
          new User({
            id: result.id,
            email: result.email,
            username: result.email,
          }),
        );
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            router.push('/auth/signin');

            return;
          }
        }

        setFetchErr(true);
      });
  }, []);

  if (user != null) {
    return children;
  } else if (fetchErr) {
    return authErrorComponent;
  } else {
    return null;
  }
}
