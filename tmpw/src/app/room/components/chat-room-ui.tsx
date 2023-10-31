import { Room, User } from '@app/store/states';
import RoomIcon from '@app/components/icons/room';
import { ChatSection } from '@app/room/components/chat-section';
import { WsMessage } from '@app/utils/ws-message';
import { WsEvents } from '@app/enums/ws-events';
import { SendMsg } from '@app/components/icons/send-msg';
import useForm from '@app/hooks/use-form';
import { useRef } from 'react';

export type ChatRoomUIProps = {
  room: Room;
  ws: WebSocket;
  user: User;
  msgStack: any[];
};

export function ChatRoomUI({ msgStack, room, user, ws }: ChatRoomUIProps) {
  const [textInput, textInputHandler, resetInputValue] = useForm({ msg: '' });

  const sendMsgButtonRef = useRef<HTMLButtonElement>(null);

  return (
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
              {room?.name}
            </span>
          </div>
          <span className={'text-[#56644C] text-[13px] font-sans'}>
            {room?.participants?.length} participant
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
          className={'w-full h-[100px] flex items-center justify-start gap-2'}
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
            onClick={() => {
              if (textInput?.msg?.trim?.() != '' && ws != null) {
                const msg = new WsMessage({
                  event: WsEvents.CHAT,
                  data: {
                    message: textInput.msg,
                    roomId: room.id,
                  },
                }).stringify();

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
  );
}
