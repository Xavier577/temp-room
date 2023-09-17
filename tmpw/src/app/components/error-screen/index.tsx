import AppLogo from '@app/components/icons/app-logo';
import UserIcon from '@app/components/icons/user-icon';

export const ErrorScreen = () => {
  return (
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
            'w-[55%] min-w-[370px] h-[55%] bg-[#110F0F] flex flex-col items-center justify-around border border-solid border-[#110F0F] drop-shadow-md'
          }
        >
          <div>
            <p className={'text-[#C9F8A9] text-[48px] font-sans'}>
              :( Something went wrong
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
