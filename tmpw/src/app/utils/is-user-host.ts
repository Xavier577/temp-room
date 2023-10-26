export const isUserHost = (room: any, userId: string) => {
  return room?.hostId === userId;
};
