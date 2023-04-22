-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT');

-- CreateTable
CREATE TABLE "user" (
    "pk" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("pk")
);

-- CreateTable
CREATE TABLE "messages" (
    "pk" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "room_pk" INTEGER NOT NULL,
    "room_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" "MessageType" DEFAULT 'TEXT',
    "sent_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sender_pk" INTEGER NOT NULL,
    "sender_id" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("pk")
);

-- CreateTable
CREATE TABLE "room_creators" (
    "pk" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "roomPk" INTEGER NOT NULL,
    "roomId" TEXT NOT NULL,
    "userPk" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "room_creators_pkey" PRIMARY KEY ("pk")
);

-- CreateTable
CREATE TABLE "room_participants" (
    "pk" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "roomPk" INTEGER NOT NULL,
    "roomId" TEXT NOT NULL,
    "userPk" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_participants_pkey" PRIMARY KEY ("pk")
);

-- CreateTable
CREATE TABLE "rooms" (
    "pk" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("pk")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_pk_id_key" ON "user"("pk", "id");

-- CreateIndex
CREATE UNIQUE INDEX "messages_id_key" ON "messages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "room_creators_id_key" ON "room_creators"("id");

-- CreateIndex
CREATE UNIQUE INDEX "room_participants_id_key" ON "room_participants"("id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_id_key" ON "rooms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_pk_id_key" ON "rooms"("pk", "id");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_pk_sender_id_fkey" FOREIGN KEY ("sender_pk", "sender_id") REFERENCES "user"("pk", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_pk_fkey" FOREIGN KEY ("room_pk") REFERENCES "rooms"("pk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_creators" ADD CONSTRAINT "room_creators_userPk_userId_fkey" FOREIGN KEY ("userPk", "userId") REFERENCES "user"("pk", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_creators" ADD CONSTRAINT "room_creators_roomPk_roomId_fkey" FOREIGN KEY ("roomPk", "roomId") REFERENCES "rooms"("pk", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_participants" ADD CONSTRAINT "room_participants_userPk_userId_fkey" FOREIGN KEY ("userPk", "userId") REFERENCES "user"("pk", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_participants" ADD CONSTRAINT "room_participants_roomPk_roomId_fkey" FOREIGN KEY ("roomPk", "roomId") REFERENCES "rooms"("pk", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
