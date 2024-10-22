/*
  Warnings:

  - You are about to drop the column `toolDescription` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `toolname` on the `Tool` table. All the data in the column will be lost.
  - Added the required column `toolName` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "toolDescription",
DROP COLUMN "toolname",
ADD COLUMN     "toolName" TEXT NOT NULL;
