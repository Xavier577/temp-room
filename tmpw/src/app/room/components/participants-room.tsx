import { Key } from 'react';
import Link from 'next/link';
import Room from '@app/components/icons/room';
import { isUserHost } from '@app/utils/is-user-host';

export function ParticipantsRoom({
  room,
  key,
  userId,
}: {
  room: Record<string, any>;
  userId: string;
  key: Key;
}) {
  return (
    <Link href={`/room/${room.id}`} key={key}>
      <div
        className={`flex flex-row items-center justify-start gap-4 px-5 w-full h-[95px] border border-solid border-[#1E1E1E] cursor-pointer`}
      >
        <Room />
        <div className={`flex flex-col w-full`}>
          <div className={`flex flex-row w-full justify-between`}>
            <span className={'text-[#AAE980] text-[16px] font-sans'}>
              {room?.name}{' '}
            </span>

            {isUserHost(room, userId) ? (
              <span className={`text-[#C9F8A9] text-[14px] font-sans`}>
                (you are host)
              </span>
            ) : null}
          </div>
          <span className={'text-[#56644C] text-[13px] font-sans'}>
            {room.description}
          </span>
        </div>
      </div>
    </Link>
  );
}
