/*
  Warnings:

  - You are about to drop the column `projectId` on the `Tool` table. All the data in the column will be lost.
  - Added the required column `checkInColor` to the `Checkin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkInQuantity` to the `Checkin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_projectId_fkey";

-- AlterTable
ALTER TABLE "Checkin" ADD COLUMN     "checkInColor" TEXT NOT NULL,
ADD COLUMN     "checkInQuantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "projectId";
