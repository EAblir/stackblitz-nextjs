/*
  Warnings:

  - Made the column `userId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Instruction" ALTER COLUMN "administrationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "userId" SET NOT NULL;
