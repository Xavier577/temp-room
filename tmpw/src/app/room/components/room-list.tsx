import mapReduce from '@app/utils/map-reduce';
import { JSX } from 'react';
import Link from 'next/link';
import RoomIcon from '@app/components/icons/room';

export type RoomListProps = {
  currentRoomId: string;
  rooms: Map<string, any>;
};
export function RoomList({ currentRoomId, rooms }: RoomListProps) {
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
}
