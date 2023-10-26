'use client';

import { useEffect, useRef, useState } from 'react';
import tempRoom from '@app/services/temp-room';
import useAppStore from '@app/store/index';
import { Participant, Room, User } from '@app/store/states';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import useForm from '@app/hooks/use-form';
import AppLogo from '@app/components/icons/app-logo';
import RoomIcon from '@app/components/icons/room';
import Link from 'next/link';
import { useWebsocket } from '@app/hooks/use-websocket';
import { SendMsg } from '@app/components/icons/send-msg';
import { ChatSection } from '@app/room/components/chat-section';
import { RoomList } from '@app/room/components/room-list';
import Protected from '@app/components/protected';

export type RoomParamProp = {
  params: { id: string };
};

export default function ChatRoom({ params }: RoomParamProp) {
  const getAccessToken = useAppStore((state) => state.getAccessToken);
  const appendRoom = useAppStore((state) => state.appendRoom);
  const rooms = useAppStore((state) => state.rooms);

  const accessToken = getAccessToken();
  const user = useAppStore((state) => state.user);

  const setUser = useAppStore((state) => state.setUser);

  const router = useRouter();

  const [roomNotFound, setRoomNotFound] = useState(false);

  const [invalidId, setInvalidId] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  const [fetchErr, setFetchErr] = useState(false);

  const [isPartOfRoom, setIsPartOfRoom] = useState(false);

  const [isHost, setIsHost] = useState(false);

  const [textInput, textInputHandler, resetInputValue] = useForm({ msg: '' });

  const [msgStack, setMsgStack] = useState<any[]>([]);

  const sendMsgButtonRef = useRef<HTMLButtonElement>(null);

  const [ws, connectSocket] = useWebsocket({
    onMessage: (_, event) => {
      const msg = JSON.parse(event.data);
      if (msg.error != null) {
        console.log(msg.error);
        return;
      }

      if (msg?.data != null) {
        setMsgStack((currentState) => [...currentState, msg]);
      }
    },
    onError: (event) => console.error(event),
    onClose: (event) => {
      setMsgStack([]);
      console.log(event);
    },
  });

  useEffect(() => {
    (async () => {
      let userData: User;
      try {
        userData = await tempRoom.fetchUserProfile<User>(accessToken);

        setUser(
          new User({
            id: userData.id,
            email: userData.email,
            username: userData.username,
          }),
        );
      } catch (err) {
        console.error(err);
        setFetchErr(true);

        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            router.push('/auth/login');
          }
        }
      }

      try {
        const roomData = await tempRoom.fetchRoom(params.id);

        appendRoom(
          new Room({
            id: roomData.id,
            name: roomData.name,
            description: roomData.description,
            hostId: roomData.hostId,
            participants: roomData.participants,
          }),
        );

        const PART_OF_ROOM = Array.from(
          roomData?.participants as Participant[],
        ).some((p) => p.id === userData!.id);

        setIsPartOfRoom(PART_OF_ROOM);

        setIsHost(roomData?.hostId === userData!.id);

        const url = `${process.env.temproomSocketBaseUrl}?ticket=${accessToken}`;

        connectSocket(url);
      } catch (err) {
        console.error(err);
        if (err instanceof AxiosError) {
          setErrMsg(err.response?.data);
          switch (err.response?.status) {
            case 400:
              setInvalidId(true);
              break;
            case 401:
              router.push('/auth/login');
              break;
            case 404:
              setRoomNotFound(true);
              break;
          }
        }
      }
    })();

    return () => {
      setMsgStack([]);
    };
  }, []);

  useEffect(() => {
    tempRoom
      .getRoomsUserIsIn(accessToken)
      .then((data: any[]) => {
        for (const roomData of data) {
          appendRoom(
            new Room({
              id: roomData.id,
              name: roomData.name,
              description: roomData.description,
              hostId: roomData.hostId,
              participants: roomData.participants,
            }),
          );
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Protected>
      <main className={'flex flex-row h-screen bg-[#110F0F]'}>
        {(() => {
          if (rooms.get(params.id) && isPartOfRoom) {
            return (
              <>
                <div className={'w-max h-full'}>
                  <div
                    className={
                      'w-full h-[85px] flex items-center justify-center border border-solid border-[#1E1E1E]'
                    }
                  >
                    <Link href={'/'}>
                      <AppLogo />
                    </Link>
                  </div>
                  <div
                    className={
                      'w-full h-[calc(100%-85px)] border border-solid border-[#1E1E1E]'
                    }
                  >
                    <RoomList currentRoomId={params.id} rooms={rooms} />
                  </div>
                </div>
                <div className={'w-full h-full'}>
                  <div
                    className={
                      'w-full h-[85px] flex flex-row items-center justify-start gap-2'
                    }
                  >
                    <div className={'w-max h-max pl-5'}>
                      <RoomIcon />
                    </div>
                    <div className={`flex flex-col w-max`}>
                      <div className={`flex flex-row w-full justify-between`}>
                        <span
                          className={'text-[#AAE980] text-[16px] font-sans'}
                        >
                          {'Travel talk'}
                        </span>
                      </div>
                      <span className={'text-[#56644C] text-[13px] font-sans'}>
                        {'3 participant'}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`
                  w-[calc(100%-35px)]
                  max-w-[1500px] 
                  h-[calc(97%-85px)] 
                  flex 
                  flex-col 
                  items-center 
                  justify-between 
                  border 
                  border-solid 
                  border-[#1E1E1E]
                  `}
                  >
                    <ChatSection msgStack={msgStack} user={user} socket={ws} />

                    {/* Input box*/}
                    <section
                      className={
                        'w-full h-[100px] flex items-center justify-start gap-2'
                      }
                    >
                      <textarea
                        className={`
                      w-[700px] 
                      ml-1.5 
                      pt-5
                      pl-10
                      resize-none
                      text-[#AAE980] 
                      bg-[#1E1E1E]
                      border
                      border-solid 
                      border-[#56644C] 
                      hover:border-[#AAE980] 
                      focus:border-[#AAE980]
                      focus:outline-none 
                      placeholder-[#56644C]
                      `}
                        placeholder={'Type a Message...'}
                        name={'msg'}
                        value={textInput.msg}
                        onChange={textInputHandler}
                        onKeyDown={(e) => {
                          if (e.code === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMsgButtonRef?.current?.click();
                          }
                        }}
                      ></textarea>

                      <button
                        ref={sendMsgButtonRef}
                        onClick={(e) => {
                          if (textInput?.msg?.trim?.() != '' && ws != null) {
                            const msg = JSON.stringify({
                              event: 'chat',
                              data: {
                                message: textInput.msg,
                                roomId: rooms.get(params.id)?.id,
                              },
                            });
                            ws.send(msg);
                            resetInputValue('msg');
                          }
                        }}
                      >
                        <SendMsg />
                      </button>
                    </section>
                  </div>
                </div>
              </>
            );
          }

          if (roomNotFound || invalidId) {
            return <p>{errMsg}</p>;
          }

          if (fetchErr) {
            return <p>Something went wrong</p>;
          }
        })()}
      </main>
    </Protected>
  );
}
