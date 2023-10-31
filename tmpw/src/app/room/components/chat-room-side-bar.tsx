import Link from 'next/link';
import AppLogo from '@app/components/icons/app-logo';
import { RoomList } from '@app/room/components/room-list';
import { Room } from '@app/store/states';

export type ChatRoomSideBarProps = {
  currentRoomId: string;
  participatingRooms: Map<string, Room>;
};

export function ChatRoomSideBar({
  currentRoomId,
  participatingRooms,
}: ChatRoomSideBarProps) {
  return (
    <div className={'w-max min-w-[300px] h-full'}>
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
          'w-full h-[calc(100%-85px)] border border-solid border-[#1E1E1E] overflow-y-scroll'
        }
      >
        <RoomList currentRoomId={currentRoomId} rooms={participatingRooms} />
      </div>
    </div>
  );
}
