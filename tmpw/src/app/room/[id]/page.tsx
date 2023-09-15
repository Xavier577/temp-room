'use client';

import { useEffect, useState } from 'react';
import tempRoom from '@services/temp-room';
import useAppStore from '@store/index';
import { Participant, Room, User } from '@store/states';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import useForm from '@hooks/use-form';

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

        setIsPartOfRoom(
          Array.from(roomData?.participants as Participant[]).some(
            (p) => p.id === userData!.id,
          ),
        );

        setIsHost(roomData?.hostId === userData!.id);
      } catch (err) {
        console.error(err);
        if (err instanceof AxiosError) {
          setErrMsg(err.response?.data?.message);
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

      const ws = new WebSocket(
        `ws://127.0.0.1:9000/api/room?ticket=${accessToken}`,
      );

      ws.addEventListener('open', (e) => {
        console.log(e);
        alert('connected');
        setWs(ws);
      });

      ws.addEventListener('message', (e) => {
        const msg = JSON.parse(e.data);

        console.log(msg);

        if (msg.error != null) {
          console.log(msg.error);
          return;
        }

        setMsgStack((currState) => {
          return [...currState, msg];
        });
      });

      ws.addEventListener('error', (e) => {
        console.error(e);
      });

      ws.addEventListener('close', (e) => {
        console.log(e);
      });
    })();
  }, [accessToken, appendRoom, params.id, router]);

  return (
    <>
      {(() => {
        if (rooms.get(params.id)) {
          return (
            <div
              className={'h-screen bg-white text-black flex flex-col p-5 gap-4'}
            >
              {isPartOfRoom ? (
                <>
                  <p>room_name: {rooms.get(params.id)?.name}</p>
                  <p>room_description: {rooms.get(params.id)?.description}</p>

                  <p>user: {user?.username}</p>
                  <p>user_is_host: {JSON.stringify(isHost)}</p>

                  <textarea
                    className={'bg-teal-100'}
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
                        // send message to socket
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

                  <br />

                  {ws != null &&
                    msgStack?.map((msg) => {
                      const TextComponent = (props: { key: any }) => (
                        <div key={props.key}>
                          <pre>senderUsername: {msg?.data?.senderUsername}</pre>
                          <pre>senderId: {msg?.data?.senderId}</pre>
                          <pre>sentAt: {msg?.data?.sentAt}</pre>
                          <pre>text: {msg?.data?.text}</pre>
                        </div>
                      );

                      // setMsgStack((currState) => {
                      //   currState.pop();
                      //   return currState;
                      // });

                      return <TextComponent key={msg?.data?.id} />;
                    })}
                </>
              ) : (
                <>
                  <p>room_name: {rooms.get(params.id)?.name}</p>
                  <p>room_description: {rooms.get(params.id)?.description}</p>

                  <p>user: {user?.username}</p>
                  <button
                    className={'bg-teal-100 border-none w-max p-1.5 font-mono'}
                  >
                    Join
                  </button>
                </>
              )}
            </div>
          );
        }

        if (roomNotFound || invalidId) {
          return <p>{errMsg}</p>;
        }

        if (fetchErr) {
          return <p>Something went wrong</p>;
        }
      })()}
    </>
  );
}
