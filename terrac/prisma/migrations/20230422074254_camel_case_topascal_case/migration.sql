/*
  Warnings:

  - You are about to drop the column `messageType` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `room_creators` table. All the data in the column will be lost.
  - You are about to drop the column `roomPk` on the `room_creators` table. All the data in the column will be lost.
  - You are about to drop the column `joinedAt` on the `room_participants` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `room_participants` table. All the data in the column will be lost.
  - You are about to drop the column `roomPk` on the `room_participants` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `room_participants` table. All the data in the column will be lost.
  - You are about to drop the column `userPk` on the `room_participants` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `roomName` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `rooms` table. All the data in the column will be lost.
  - Added the required column `room_id` to the `room_creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_pk` to the `room_creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participant_id` to the `room_participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participant_pk` to the `room_participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_id` to the `room_participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_pk` to the `room_participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_code` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "room_creators" DROP CONSTRAINT "room_creators_roomPk_roomId_fkey";

-- DropForeignKey
ALTER TABLE "room_participants" DROP CONSTRAINT "room_participants_roomPk_roomId_fkey";

-- DropForeignKey
ALTER TABLE "room_participants" DROP CONSTRAINT "room_participants_userPk_userId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "messageType",
ADD COLUMN     "message_type" "MessageType" DEFAULT 'TEXT';

-- AlterTable
ALTER TABLE "room_creators" DROP COLUMN "roomId",
DROP COLUMN "roomPk",
ADD COLUMN     "room_id" TEXT NOT NULL,
ADD COLUMN     "room_pk" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "room_participants" DROP COLUMN "joinedAt",
DROP COLUMN "roomId",
DROP COLUMN "roomPk",
DROP COLUMN "userId",
DROP COLUMN "userPk",
ADD COLUMN     "joined_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "participant_id" TEXT NOT NULL,
ADD COLUMN     "participant_pk" INTEGER NOT NULL,
ADD COLUMN     "room_id" TEXT NOT NULL,
ADD COLUMN     "room_pk" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "createdAt",
DROP COLUMN "roomName",
DROP COLUMN "updateAt",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "room_code" TEXT NOT NULL,
ADD COLUMN     "update_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "room_creators" ADD CONSTRAINT "room_creators_room_pk_room_id_fkey" FOREIGN KEY ("room_pk", "room_id") REFERENCES "rooms"("pk", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_participants" ADD CONSTRAINT "room_participants_participant_pk_participant_id_fkey" FOREIGN KEY ("participant_pk", "participant_id") REFERENCES "user"("pk", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_participants" ADD CONSTRAINT "room_participants_room_pk_room_id_fkey" FOREIGN KEY ("room_pk", "room_id") REFERENCES "rooms"("pk", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
