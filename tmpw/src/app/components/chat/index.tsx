'use client';

export default function Chat() {
  const ws = new WebSocket('ws://127.0.0.1:9000/api/room');
  return <div>chat</div>;
}
