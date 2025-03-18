/*
  Warnings:

  - You are about to drop the column `is_personal` on the `calendars` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CalendarType" AS ENUM ('PERSONAL', 'SHARED', 'HOLIDAYS');

-- AlterTable
ALTER TABLE "calendars" DROP COLUMN "is_personal",
ADD COLUMN     "type" "CalendarType" NOT NULL DEFAULT 'SHARED';
