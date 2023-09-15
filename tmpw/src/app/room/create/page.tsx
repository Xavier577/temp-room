'use client';

import useForm from '@hooks/use-form';
import tempRoom from '@services/temp-room';
import useAppStore from '@store/index';
import { useRouter } from 'next/navigation';

export default function CreateRoom() {
  const [formField, handleChange] = useForm({
    roomName: '',
    roomDescription: '',
  });

  const router = useRouter();

  const getAccessToken = useAppStore((state) => state.getAccessToken);

  const accessToken = getAccessToken();

  return (
    <div className={'bg-white text-black h-screen flex flex-col'}>
      <form
        className={'flex flex-col gap-4'}
        method={'POST'}
        onSubmit={(e) => {
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
        }}
      >
        <input
          className={'w-max p-2'}
          placeholder={'Room Name'}
          type={'text'}
          name={'roomName'}
          value={formField.roomName}
          onChange={handleChange}
          required={true}
        />

        <input
          className={'w-max p-2'}
          placeholder={'Description'}
          type={'text'}
          name={'roomDescription'}
          value={formField.roomDescription}
          onChange={handleChange}
        />

        <button className={'w-max p-2 bg-black text-white'} type={'submit'}>
          Submit
        </button>
      </form>
    </div>
  );
}
