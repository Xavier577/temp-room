'use client';

import AppLogo from '@app/components/icons/app-logo';
import UserIcon from '@app/components/icons/user-icon';
import { FormEvent, useEffect, useState } from 'react';
import tempRoom from '@app/services/temp-room';
import useAppStore from '@app/store';
import Protected from '@app/components/protected';
import useForm from '@app/hooks/use-form';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { ParticipantsRoom } from '@app/room/components/participants-room';
import { useError } from '@app/hooks/use-error';

export default function Lobby() {
  const router = useRouter();
  const [roomIdInput, handleInputChange] = useForm({ roomId: '' });
  const [err, setErr] = useError<
    'INVALID_ID' | 'ROOM_NOT_FOUND' | 'INTERNAL'
  >();

  const user = useAppStore((state) => state.user);
  const getAccessToken = useAppStore((state) => state.getAccessToken);
  const accessToken = getAccessToken();

  const [roomsUserIsin, setRoomsUserIsin] = useState<{ [name: string]: any }[]>(
    [],
  );

  const joinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    tempRoom
      .fetchRoom(roomIdInput.roomId)
      .then((data) => {
        router.push(`/room/${data.id}`);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          setErr((currState) => {
            if (currState == null) {
              return { msg: error.response?.data, code: 'INTERNAL' };
            }
            return {
              ...currState,
              code: 'INTERNAL',
              msg: error.response?.data,
            };
          });
          switch (error.response?.status) {
            case 400:
              setErr({
                msg: error.response?.data,
                code: 'INVALID_ID',
              });
              break;
            case 404:
              setErr({
                msg: error?.response.data,
                code: 'ROOM_NOT_FOUND',
              });
              break;
          }
        }
      });
  };

  useEffect(() => {
    tempRoom
      .getRoomsUserIsIn(accessToken)
      .then((data) => {
        setRoomsUserIsin(data);
      })
      .catch((err) => console.error(err));
  }, [accessToken]);

  return (
    <Protected>
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
          h-[90%]
          bg-[#110F0F] 
          flex 
          flex-col 
          items-center
          justify-center 
          gap-[15px]
          border 
          border-solid 
          border-[#110F0F] 
          drop-shadow-md
          `}
          >
            <div>
              <h1 className={'text-[#C9F8A9] text-[32px] font-sans'}>
                Join Room
              </h1>
            </div>

            <form
              className={`flex flex-col w-[80%] h-[30%] items-center justify-center gap-[35px]`}
              onSubmit={joinRoom}
            >
              <div className={'w-[80%] h-max flex flex-col'}>
                <input
                  className={`
                  w-full 
                  h-[70px] 
                  px-2 
                  bg-[#1E1E1E]
                  border 
                  border-solid 
                  text-[#AAE980] 
                  ${
                    err != null
                      ? 'border-red-400 hover:border-red-400 focus:border-red-500'
                      : 'border-[#56644C] hover:border-[#AAE980] focus:border-[#AAE980]'
                  } 
                  focus:outline-none 
                  placeholder-[rgba(201,248,169,0.67)]
                  `}
                  placeholder={'Enter room id'}
                  name={'roomId'}
                  value={roomIdInput.roomId}
                  onChange={(e) => {
                    setErr(null);
                    handleInputChange(e);
                  }}
                  type={'text'}
                  required={true}
                />
              </div>

              <div className={'flex flex-row w-[80%] justify-end items-end'}>
                <button
                  className={
                    'w-[100px] h-[50px] bg-[#C9F8A9] text-[14px] text-[#110F0F]'
                  }
                  type={'submit'}
                >
                  Join
                </button>
              </div>
              {err != null ? (
                <span className={'text-red-500'}>{err.msg}</span>
              ) : null}
            </form>

            {roomsUserIsin.length > 0 ? (
              <div
                className={
                  'w-[64%] min-w-[420px] max-h-[325px] border border-solid border-[#1E1E1E] overflow-y-scroll'
                }
              >
                <div
                  className={
                    'flex flex-row items-center justify-center w-full h-[75px] border border-solid border-[#1E1E1E]'
                  }
                >
                  <h3 className={'text-[#C9F8A9] text-[16px] font-sans'}>
                    Rooms you are currently in
                  </h3>
                </div>

                {roomsUserIsin.map((room, idx) => (
                  <ParticipantsRoom room={room} userId={user!.id} key={idx} />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </Protected>
  );
}
