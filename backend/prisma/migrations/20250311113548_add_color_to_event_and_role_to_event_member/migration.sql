/*
  Warnings:

  - Added the required column `color` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_members" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'VIEWER';

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "color" VARCHAR(7) NOT NULL;
