'use client';

import { useRouter } from 'next/navigation';
import AppLogo from '@app/components/icons/app-logo';
import UserIcon from '@app/components/icons/user-icon';
import Protected from '@app/components/protected/protected';

export default function Home() {
  const router = useRouter();

  return (
    <Protected>
      <main className="flex flex-col h-screen bg-[#110F0F]">
        <header className={'flex flex-row justify-between p-10 w-full'}>
          <AppLogo />
          <UserIcon />
        </header>

        <section
          className={'flex flex-col items-center justify-center w-full h-full'}
        >
          <div
            className={
              'w-[55%] min-w-[370px] h-[55%] bg-[#110F0F] flex flex-col items-center justify-evenly gap-[50px] border border-solid border-[#110F0F] drop-shadow-md'
            }
          >
            <div>
              <p className={'text-[#C9F8A9] text-[48px] font-sans'}>
                Conversations on the fly
              </p>
            </div>

            <div className={'w-[50%] flex justify-between font-sans'}>
              <button
                className={
                  'w-[100px] h-[50px] bg-[#C9F8A9] text-[14px] text-[#110F0F]'
                }
                onClick={() => router.push('/room/create')}
              >
                Create Room
              </button>
              <button
                className={
                  'w-[100px] h-[50px] bg-[#1E1E1E] text-[14px] text-[#C9F8A9]'
                }
                onClick={() => router.push('/room')}
              >
                Join Room
              </button>
            </div>
          </div>
        </section>
      </main>
    </Protected>
  );
}
