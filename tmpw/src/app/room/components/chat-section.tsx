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
            if (msg?.event == WsEvents.CHAT) {
              return (
                <ChatMessage
                  componentKey={`${idx}-${msg?.data?.id}`}
                  msgData={msg?.data}
                  isSelf={msg?.data?.sender?.id === user?.id}
                />
              );
            }
          })
        : null}
    </section>
  );
}
