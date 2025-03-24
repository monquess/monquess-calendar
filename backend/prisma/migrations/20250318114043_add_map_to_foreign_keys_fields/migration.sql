/*
  Warnings:

  - The primary key for the `event_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `eventId` on the `event_members` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `event_members` table. All the data in the column will be lost.
  - You are about to drop the column `calendarId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `events` table. All the data in the column will be lost.
  - Added the required column `event_id` to the `event_members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `event_members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calendar_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event_members" DROP CONSTRAINT "event_members_eventId_fkey";

-- DropForeignKey
ALTER TABLE "event_members" DROP CONSTRAINT "event_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_calendarId_fkey";

-- AlterTable
ALTER TABLE "event_members" DROP CONSTRAINT "event_members_pkey",
DROP COLUMN "eventId",
DROP COLUMN "userId",
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "event_members_pkey" PRIMARY KEY ("event_id", "user_id");

-- AlterTable
ALTER TABLE "events" DROP COLUMN "calendarId",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "calendar_id" INTEGER NOT NULL,
ADD COLUMN     "end_date" TIMESTAMPTZ,
ADD COLUMN     "start_date" TIMESTAMPTZ NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_members" ADD CONSTRAINT "event_members_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_members" ADD CONSTRAINT "event_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
