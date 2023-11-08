import { User } from '@app/store/states';
import { reverseMap } from '@app/utils/reverse-map';
import { ChatMessage } from '@app/room/components/chat-message';
import { WsEvents } from '@app/enums/ws-events';

export function ChatSection({
  msgStack,
  socket,
  user,
}: {
  msgStack: any[];
  user?: User;
  socket?: WebSocket;
}) {
  return (
    <section
      className={'flex flex-col-reverse overflow-y-scroll w-full h-full'}
    >
      {socket != null && user != null
        ? reverseMap(msgStack, (msg, idx) => {
            if (msg?.event === WsEvents.CHAT) {
              return (
                <ChatMessage
                  componentKey={`${idx}-${msg?.data?.id}`}
                  msgData={msg?.data}
                  isSelf={msg?.data?.sender?.id === user?.id}
                />
              );
            } else if (msg?.event === WsEvents.JOIN_ROOM) {
              return (
                <div
                  className={
                    'w-full h-max flex flex-row items-center justify-center mt-2'
                  }
                >
                  <span
                    className={
                      "w-max p-2 bg-[rgba(30,30,30,0.6)] text-[#56644C] text-[12px] border border-solid border-transparent rounded p-1'"
                    }
                  >
                    {msg?.data?.message}
                  </span>
                </div>
              );
            }
          })
        : null}
    </section>
  );
}
