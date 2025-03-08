-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VIEWER', 'EDITOR', 'OWNER');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('INVITED', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "calendars" (
    "id" SERIAL NOT NULL,
    "is_personal" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(7) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calendars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_members" (
    "user_id" INTEGER NOT NULL,
    "calendar_id" INTEGER NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "status" "InvitationStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calendar_members_pkey" PRIMARY KEY ("user_id","calendar_id")
);

-- AddForeignKey
ALTER TABLE "calendar_members" ADD CONSTRAINT "calendar_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_members" ADD CONSTRAINT "calendar_members_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
