-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('LOCAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider" "Provider" NOT NULL DEFAULT 'LOCAL';
