enum WsEvents {
  CHAT = 'chat',
  END_ROOM = 'end_room',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  REMOVE_PARTICIPANT = 'remove_participant',
  SYNC = 'sync',
}

export const {
  CHAT,
  END_ROOM,
  JOIN_ROOM,
  LEAVE_ROOM,
  REMOVE_PARTICIPANT,
  SYNC,
} = WsEvents;

export default WsEvents;
