'use client';

import { JSX, useEffect, useState } from 'react';
import tempRoom from '@app/services/temp-room';
import useAppStore from '@app/store/index';
import { Participant, Room, User } from '@app/store/states';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import useForm from '@app/hooks/use-form';
import AppLogo from '@app/components/icons/app-logo';
import RoomIcon from '@app/components/icons/room';
import Link from 'next/link';
import mapReduce from '@app/utils/map-reduce';

export type RoomListProps = {
  currentRoomId: string;
  rooms: Map<string, any>;
};

const RoomList = ({ currentRoomId, rooms }: RoomListProps) => {
  return mapReduce<JSX.Element[]>(rooms, [], (room, accumulator, key) => {
    accumulator.push(
      <Link href={`/room/${room.id}`} key={key}>
        <div
          className={`flex flex-row ${
            currentRoomId === room.id ? 'bg-[#1E1E1E]' : ''
          } items-center justify-start gap-4 px-5 w-[320px] h-[95px] border border-solid border-[#1E1E1E] cursor-pointer`}
          key={key}
        >
          <RoomIcon />
          <div className={`flex flex-col w-full`}>
            <div className={`flex flex-row w-full justify-between`}>
              <span className={'text-[#AAE980] text-[16px] font-sans'}>
                {room?.name}{' '}
              </span>
            </div>
            <span className={'text-[#56644C] text-[13px] font-sans'}>
              {room.description}
            </span>
          </div>
        </div>
      </Link>,
    );

    return accumulator;
  });
};

export type RoomParamProp = {
  params: { id: string };
};

export default function EnterRoom({ params }: RoomParamProp) {
  const [ws, setWs] = useState<WebSocket>();

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

  const [textInput, textInputHandler] = useForm({ msg: '' });

  const [msgStack, setMsgStack] = useState<any[]>([]);

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
        const roomData = await tempRoom.fetchRoom(accessToken, params.id);

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

        // establish websocket connection
        const ws = new WebSocket(
          `ws://127.0.0.1:9000/api/room?ticket=${accessToken}`,
        );

        ws.addEventListener('open', (e) => {
          setWs(ws);

          if (!PART_OF_ROOM) {
            ws.send(
              JSON.stringify({
                event: 'join_room',
                data: {
                  roomId: params.id,
                },
              }),
            );
          }
        });

        ws.addEventListener('message', (e) => {
          const msg = JSON.parse(e.data);

          console.log(msg);

          if (msg.error != null) {
            console.log(msg.error);

            return;
          }

          switch (msg.event) {
            case 'chat':
              setMsgStack((currState) => {
                return [...currState, msg];
              });
              break;
          }
        });

        ws.addEventListener('error', (e) => {
          console.error(e);
        });

        ws.addEventListener('close', (e) => {
          console.log(e);
        });
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
  }, [accessToken, appendRoom, params.id, router]);

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
  }, [accessToken]);

  return (
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
                  <AppLogo />
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
                      <span className={'text-[#AAE980] text-[16px] font-sans'}>
                        {'Travel talk'}
                      </span>
                    </div>
                    <span className={'text-[#56644C] text-[13px] font-sans'}>
                      {'3 participant'}
                    </span>
                  </div>
                </div>
                <div
                  className={
                    'w-[calc(100%-35px)] h-[calc(97%-85px)] flex flex-col items-center justify-start border border-solid border-[#1E1E1E]'
                  }
                >
                  {/*   Message section */}

                  <textarea
                    className={'bg-white text-blue-950 w-[200px]'}
                    name={'msg'}
                    value={textInput.msg}
                    onChange={textInputHandler}
                  ></textarea>

                  <button
                    className={
                      'bg-teal-400 text-blue-950 border-none w-max p-1.5 font-mono'
                    }
                    onClick={(e) => {
                      if (textInput.msg != '') {
                        // send message to socket*/}
                        const msg = JSON.stringify({
                          event: 'chat',
                          data: {
                            message: textInput.msg,
                            roomId: rooms.get(params.id)?.id,
                          },
                        });

                        ws?.send(msg);
                      }
                    }}
                  >
                    Send
                  </button>

                  {ws != null &&
                    msgStack?.map((msg, idx) => {
                      const TextComponent = (props: { key: any }) => (
                        <div key={props.key}>
                          <pre>senderUsername: {msg?.data?.senderUsername}</pre>
                          <pre>senderId: {msg?.data?.senderId}</pre>
                          <pre>sentAt: {msg?.data?.sentAt}</pre>
                          <pre>text: {msg?.data?.text}</pre>
                        </div>
                      );

                      return <TextComponent key={`${idx}-${msg?.data?.id}`} />;
                    })}
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
  );
}
