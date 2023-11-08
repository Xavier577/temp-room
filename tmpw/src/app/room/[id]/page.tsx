'use client';

import { useEffect, useState } from 'react';
import useAppStore from '@app/store/index';
import { useWebsocket } from '@app/hooks/use-websocket';
import Protected from '@app/components/protected';
import { ChatRoomUI } from '@app/room/components/chat-room-ui';
import { ChatRoomSideBar } from '@app/room/components/chat-room-side-bar';
import { Puff } from '@app/components/puff';
import { useError } from '@app/hooks/use-error';
import tempRoom from '@app/services/temp-room';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { SIGN_IN_PATH } from '@app/const';
import { Room, User } from '@app/store/states';
import { WsMessage } from '@app/utils/ws-message';
import { WsEvents } from '@app/enums/ws-events';

export type RoomParamProp = {
  params: { id: string };
};

export default function ChatRoom({ params }: RoomParamProp) {
  const user = useAppStore((state) => state.user);
  const getAccessToken = useAppStore((state) => state.getAccessToken);
  const accessToken = getAccessToken();
  const setUser = useAppStore((state) => state.setUser);
  const rooms = useAppStore((state) => state.rooms);
  const appendRoom = useAppStore((state) => state.appendRoom);
  const [currentRoom, setCurrentRoom] = useState<Room>();
  const [isPartOfRoom, setIsPartOfRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [msgStack, setMsgStack] = useState<any[]>([]);
  const [ws, connectSocket] = useWebsocket({
    onMessage: (_, event) => {
      const msg = JSON.parse(event.data);
      if (msg.error != null) {
        console.error(msg.error);
        return;
      }

      if (msg?.event == WsEvents.JOIN_ROOM) {
        setIsPartOfRoom(true);
        setCurrentRoom((currentState) => msg?.data?.roomUpdate ?? currentState);
      }

      setMsgStack((currentState) => {
        if (msg?.event === WsEvents.SYNC) {
          const syncedChat = msg?.data?.map((m: any) => ({
            data: {
              id: m.id,
              text: m.text,
              sender: m.sender,
              sentAt: m.sentAt,
            },
            event: WsEvents.CHAT,
          }));

          return [...syncedChat, ...currentState];
        }
        return [...currentState, msg];
      });
    },
    onError: (event) => console.error(event),
    onClose: (_event) => {
      setMsgStack([]);
    },
  });
  const [err, setErr] = useError<
    'ROOM_NOT_FOUND' | 'INVALID_ROOM_ID' | 'INTERNAL'
  >();

  const router = useRouter();

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

        tempRoom
          .fetchRoom(params.id)
          .then((roomData) => {
            const room = new Room({
              id: roomData.id,
              name: roomData.name,
              description: roomData.description,
              hostId: roomData.hostId,
              participants: roomData.participants ?? [],
            });

            setCurrentRoom(room);

            const PART_OF_ROOM = room.participants.some(
              (p) => p.id === userData?.id,
            );

            setIsPartOfRoom(PART_OF_ROOM);

            const url = `${process.env.temproomSocketBaseUrl}?ticket=${accessToken}`;

            connectSocket(url).then((ws) => {
              if (!PART_OF_ROOM) {
                setIsJoiningRoom(true);
                const joinMsg = new WsMessage({
                  event: WsEvents.JOIN_ROOM,
                  data: { roomId: params.id },
                }).stringify();

                ws.send(joinMsg);
              }
            });
          })
          .catch((error) => {
            console.error(error);
            if (error instanceof AxiosError) {
              switch (error.response?.status) {
                case 400:
                  setErr({
                    code: 'INVALID_ROOM_ID',
                    msg: error?.response?.data,
                  });
                  break;
                case 401:
                  router.push(SIGN_IN_PATH);
                  break;
                case 404:
                  setErr({
                    code: 'ROOM_NOT_FOUND',
                    msg: error?.response?.data,
                  });
                  break;
              }
            } else {
              setErr({ code: 'INTERNAL', msg: 'Something went wrong' });
            }
          });
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            router.push(SIGN_IN_PATH);
          }
        } else {
          setErr({ code: 'INTERNAL', msg: 'something went wrong' });
        }
      });
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
  }, [isPartOfRoom]);

  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    if (isPartOfRoom && currentRoom != null && ws != null && user != null) {
      setShowUI(true);

      if (ws.readyState === WebSocket.OPEN) {
        const syncMsg = new WsMessage({
          event: WsEvents.SYNC,
          data: { roomId: params.id },
        }).stringify();

        ws.send(syncMsg);
      }
    }
  }, [isPartOfRoom, ws, currentRoom, user]);
  return (
    <Protected>
      <main className={'flex flex-row h-screen bg-[#110F0F]'}>
        <ChatRoomSideBar currentRoomId={params.id} participatingRooms={rooms} />
        {showUI ? (
          <ChatRoomUI
            room={currentRoom!}
            ws={ws!}
            user={user!}
            msgStack={msgStack}
          />
        ) : (
          <div
            className={
              'w-full h-full flex flex-col items-center justify-center gap-2'
            }
          >
            {err != null ? (
              <p>{err.msg}</p>
            ) : (
              <>
                <Puff />
                {isJoiningRoom ? (
                  <span className={'text-[#AAE980]'}>Joining room</span>
                ) : null}
              </>
            )}
          </div>
        )}
      </main>
    </Protected>
  );
}
