/*
  Warnings:

  - You are about to drop the column `assignee` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "assignee",
ADD COLUMN     "assigneeId" INTEGER,
ALTER COLUMN "userId" DROP NOT NULL;
