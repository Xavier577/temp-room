'use client';

import { useEffect, useState } from 'react';
import useAppStore from '@app/store/index';
import { useWebsocket } from '@app/hooks/use-websocket';
import Protected from '@app/components/protected';
import { ChatRoomUI } from '@app/room/components/chat-room-ui';
import { ChatRoomSideBar } from '@app/room/components/chat-room-side-bar';
import { Puff } from '@app/components/puff';
import { useError } from '@app/hooks/use-error';
import { useUser } from '@app/hooks/use-user';
import tempRoom from '@app/services/temp-room';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { SIGN_IN_PATH } from '@app/const';
import { Room } from '@app/store/states';
import { WsMessage } from '@app/utils/ws-message';
import { WsEvents } from '@app/enums/ws-events';

export type RoomParamProp = {
  params: { id: string };
};

export default function ChatRoom({ params }: RoomParamProp) {
  const { user, accessToken, error: userFetchErr, isFetchComplete } = useUser();
  const rooms = useAppStore((state) => state.rooms);
  const appendRoom = useAppStore((state) => state.appendRoom);
  const [currentRoom, setCurrentRoom] = useState<Room>();
  const [isPartOfRoom, setIsPartOfRoom] = useState(false);
  const [msgStack, setMsgStack] = useState<any[]>([]);
  const [ws, connectSocket] = useWebsocket({
    onMessage: (_, event) => {
      const msg = JSON.parse(event.data);
      if (msg.error != null) {
        console.log(msg.error);
        return;
      }

      if (msg?.event === WsEvents.JOIN_ROOM) {
        setIsPartOfRoom(true);
      }

      if (msg?.data != null) {
        setMsgStack((currentState) => [...currentState, msg]);
      }
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
    if (!isFetchComplete) return;
    if (user == null) {
      if (userFetchErr != null && userFetchErr.code === 'INTERNAL') {
        setErr(userFetchErr as typeof err);
      }
    } else {
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

          const PART_OF_ROOM = room.participants.some((p) => p.id === user!.id);

          setIsPartOfRoom(PART_OF_ROOM);

          const url = `${process.env.temproomSocketBaseUrl}?ticket=${accessToken}`;

          connectSocket(url).then((ws) => {
            if (!PART_OF_ROOM) {
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
                setErr({ code: 'INVALID_ROOM_ID', msg: error?.response?.data });
                break;
              case 401:
                router.push(SIGN_IN_PATH);
                break;
              case 404:
                setErr({ code: 'ROOM_NOT_FOUND', msg: error?.response?.data });
                break;
            }
          } else {
            setErr({ code: 'INTERNAL', msg: 'Something went wrong' });
          }
        });
    }

    return () => {
      setMsgStack([]);
    };
  }, [isFetchComplete]);

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

  return (
    <Protected>
      <main className={'flex flex-row h-screen bg-[#110F0F]'}>
        <ChatRoomSideBar currentRoomId={params.id} participatingRooms={rooms} />
        {isPartOfRoom && currentRoom != null && ws != null && user != null ? (
          <ChatRoomUI
            room={currentRoom}
            ws={ws}
            user={user}
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
                <span className={'text-[#AAE980]'}>Joining room</span>
              </>
            )}
          </div>
        )}
      </main>
    </Protected>
  );
}
