'use client';

import useForm, { DataCollectionElement } from '@app/hooks/use-form';
import tempRoom from '@app/services/temp-room';
import useAppStore from '@app/store/index';
import { useRouter } from 'next/navigation';
import Protected from '@app/components/protected/protected';
import AppLogo from '@app/components/icons/app-logo';
import UserIcon from '@app/components/icons/user-icon';
import Hide from '@app/components/icons/hide';
import Show from '@app/components/icons/show';
import Link from 'next/link';
import { ChangeEventHandler, FormEvent } from 'react';

export default function CreateRoom() {
  const [formField, handleChange] = useForm({
    roomName: '',
    roomDescription: '',
  });

  const router = useRouter();

  const getAccessToken = useAppStore((state) => state.getAccessToken);

  const accessToken = getAccessToken();

  const onChangeHandler: ChangeEventHandler<DataCollectionElement> = (
    event,
  ) => {
    handleChange(event);
  };

  const submitForm = (e: FormEvent) => {
    e.preventDefault();

    tempRoom
      .createRoom(accessToken, {
        name: formField.roomName,
        description: formField.roomDescription,
      })
      .then((data) => {
        // save room to rooms state TODO: create room state
        console.log(data);

        // go to room
        router.push(`/room/${data.id}`);
      })
      .catch((err) => console.error(err));
  };

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
            className={`
          w-[55%] 
          min-w-[370px] 
          max-w-[730px]
          h-[55%] 
          bg-[#110F0F] 
          flex 
          flex-col 
          items-center 
          border 
          border-solid 
          border-[#110F0F] 
          drop-shadow-md
          `}
          >
            <div>
              <h1 className={'text-[#C9F8A9] text-[32px] font-sans'}>
                Create a Room
              </h1>
            </div>

            <form
              className={`
                flex 
                flex-col 
                w-[80%] 
                h-[70%] 
                items-center 
                justify-center 
                gap-[35px]
                `}
              method={'POST'}
              onSubmit={submitForm}
            >
              <div className={'w-[80%] h-max flex flex-col'}>
                <input
                  className={`
                  w-full 
                  h-[70px] 
                  px-2 
                  bg-[#1E1E1E]
                  border 
                  border-solid 
                  text-[#AAE980] 
                  ${
                    // 'border-red-400 hover:border-red-400 focus:border-red-500'
                    'border-[#56644C] hover:border-[#AAE980] focus:border-[#AAE980]'
                  } 
                  focus:outline-none 
                  placeholder-[rgba(201,248,169,0.67)]
                  `}
                  placeholder={'Room name'}
                  name={'roomName'}
                  type={'text'}
                  value={formField.roomName}
                  onChange={onChangeHandler}
                  required={true}
                />
              </div>

              <div className={'w-[80%] h-max flex flex-col'}>
                <input
                  className={`
                  w-full 
                  h-[70px] 
                  px-2 
                  bg-[#1E1E1E]
                  border 
                  border-solid 
                  text-[#AAE980] 
                  ${
                    //'border-red-400 hover:border-red-400 focus:border-red-500'
                    'border-[#56644C] hover:border-[#AAE980] focus:border-[#AAE980]'
                  } 
                  focus:outline-none 
                  placeholder-[rgba(201,248,169,0.67)]
                  `}
                  placeholder={'Description (optional)'}
                  name={'roomDescription'}
                  type={'text'}
                  value={formField.roomDescription}
                  onChange={onChangeHandler}
                  required={true}
                />
              </div>

              <div className={'flex flex-row w-[80%]  justify-end items-end'}>
                <button
                  className={
                    'w-[100px] h-[50px] bg-[#C9F8A9] text-[14px] text-[#110F0F]'
                  }
                  type={'submit'}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      {/*<div className={'bg-white text-black h-screen flex flex-col'}>*/}
      {/*  <form*/}
      {/*    className={'flex flex-col gap-4'}*/}
      {/*    method={'POST'}*/}
      {/*    onSubmit={(e) => {*/}
      {/*      e.preventDefault();*/}

      {/*      tempRoom*/}
      {/*        .createRoom(accessToken, {*/}
      {/*          name: formField.roomName,*/}
      {/*          description: formField.roomDescription,*/}
      {/*        })*/}
      {/*        .then((data) => {*/}
      {/*          // save room to rooms state TODO: create room state*/}
      {/*          console.log(data);*/}

      {/*          // go to room*/}
      {/*          router.push(`/room/${data.id}`);*/}
      {/*        })*/}
      {/*        .catch((err) => console.error(err));*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <input*/}
      {/*      className={'w-max p-2'}*/}
      {/*      placeholder={'Room Name'}*/}
      {/*      type={'text'}*/}
      {/*      name={'roomName'}*/}
      {/*      value={formField.roomName}*/}
      {/*      onChange={handleChange}*/}
      {/*      required={true}*/}
      {/*    />*/}

      {/*    <input*/}
      {/*      className={'w-max p-2'}*/}
      {/*      placeholder={'Description'}*/}
      {/*      type={'text'}*/}
      {/*      name={'roomDescription'}*/}
      {/*      value={formField.roomDescription}*/}
      {/*      onChange={handleChange}*/}
      {/*    />*/}

      {/*    <button className={'w-max p-2 bg-black text-white'} type={'submit'}>*/}
      {/*      Submit*/}
      {/*    </button>*/}
      {/*  </form>*/}
      {/*</div>*/}
    </Protected>
  );
}
