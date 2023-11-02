import { Fragment, Key } from 'react';

export function ChatMessage({
  componentKey,
  msgData,
  isSelf = false,
}: {
  componentKey: Key;
  msgData: Record<string, any>;
  isSelf: boolean;
}) {
  return (
    <Fragment key={componentKey}>
      {isSelf ? (
        <div
          className={`w-full h-max flex flex-row items-center justify-end mt-2`}
        >
          {/* msg-box*/}
          <div
            className={
              'bg-[#C9F8A9] w-max max-w-[500px] mr-[10px] border border-solid border-transparent rounded p-1'
            }
          >
            {/* msg-box-content*/}
            <p
              className={
                'h-max text-[13px] whitespace-pre max-w-[100%] p-1 text-[#110F0F]'
              }
            >
              {msgData?.text}
              {/*  msg-status*/}
              <div
                className={
                  'flex float-right text-[#141B27] px-3 h-max w-max flex-shrink-0'
                }
              >
                {msgData?.delivered ? (
                  <span className={'mx-1'}>&#10003;</span>
                ) : null}
                <span>
                  {new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  }).format(new Date(msgData?.sentAt))}
                </span>
              </div>
            </p>
          </div>
        </div>
      ) : (
        <div className={`w-full flex flex-row items-center justify-start mt-2`}>
          {/* msg-box*/}
          <div
            className={
              'flex flex-col bg-[#1E1E1E] w-max max-w-[500px] ml-[10px] border border-solid border-transparent rounded p-1'
            }
          >
            {/* Sender username*/}
            <span className={'text-[11px] text-[#56644C]'}>
              {msgData?.sender?.username}
            </span>
            {/* msg-box-content*/}
            <p
              className={
                'h-max text-[13px] max-w-[100%] whitespace-pre p-1 text-[#AAE980]'
              }
            >
              {msgData?.text}
              {/*  msg-status*/}
              <div
                className={
                  'flex float-right text-[#595E66] px-3 h-max w-max flex-shrink-0'
                }
              >
                <span>
                  {new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  }).format(new Date(msgData?.sentAt))}
                </span>
              </div>
            </p>
          </div>
        </div>
      )}
    </Fragment>
  );
}
