/*
  Warnings:

  - A unique constraint covering the columns `[projectName]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `checkInDate` to the `Checkin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectName` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toolname` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Checkin" ADD COLUMN     "checkInDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "checkOutDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "projectName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "toolname" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectName_key" ON "Project"("projectName");
