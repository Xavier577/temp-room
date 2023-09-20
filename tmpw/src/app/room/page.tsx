'use client';

import AppLogo from '@app/components/icons/app-logo';
import UserIcon from '@app/components/icons/user-icon';
import Room from '@app/components/icons/room';
import { useEffect, useState } from 'react';
import tempRoom from '@app/services/temp-room';
import useAppStore from '@app/store';
import Protected from '@app/components/protected/protected';
import Link from 'next/link';

const isUserHost = (room: any, userId: string) => {
  return room?.hostId === userId;
};

export default function Lobby() {
  const getAccessToken = useAppStore((state) => state.getAccessToken);

  const accessToken = getAccessToken();

  const user = useAppStore((state) => state.user);

  const [roomsUserIsin, setRoomsUserIsin] = useState<{ [name: string]: any }[]>(
    [],
  );

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
              className={`
                flex 
                flex-col 
                w-[80%] 
                h-[30%] 
                items-center 
                justify-center 
                gap-[35px]
                `}
              method={'POST'}
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
                    // 'border-red-400 hover:border-red-400 focus:border-red-500'
                    'border-[#56644C] hover:border-[#AAE980] focus:border-[#AAE980]'
                  } 
                  focus:outline-none 
                  placeholder-[rgba(201,248,169,0.67)]
                  `}
                  placeholder={'Enter room id'}
                  name={'roomId'}
                  type={'text'}
                  required={true}
                />
              </div>

              <div className={'flex flex-row w-[80%]  justify-end items-end'}>
                <button
                  className={
                    'w-[100px] h-[50px] bg-[#C9F8A9] text-[14px] text-[#110F0F]'
                  }
                  type={'submit'}
                >
                  Join
                </button>
              </div>
            </form>

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
              {roomsUserIsin.length > 0
                ? roomsUserIsin.map((room, idx) => (
                    <Link href={`/room/${room.id}`} key={idx}>
                      <div
                        className={`flex flex-row items-center justify-start gap-4 px-5 w-full h-[95px] border border-solid border-[#1E1E1E] cursor-pointer`}
                        key={idx}
                      >
                        <Room />
                        <div className={`flex flex-col w-full`}>
                          <div
                            className={`flex flex-row w-full justify-between`}
                          >
                            <span
                              className={'text-[#AAE980] text-[16px] font-sans'}
                            >
                              {room?.name}{' '}
                            </span>

                            {isUserHost(room, user!.id) ? (
                              <span
                                className={`text-[#C9F8A9] text-[14px] font-sans`}
                              >
                                (you are host)
                              </span>
                            ) : null}
                          </div>
                          <span
                            className={'text-[#56644C] text-[13px] font-sans'}
                          >
                            {room.description}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                : null}
            </div>
          </div>
        </section>
      </main>
    </Protected>
  );
}
