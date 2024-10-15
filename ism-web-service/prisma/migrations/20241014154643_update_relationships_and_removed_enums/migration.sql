/*
  Warnings:

  - You are about to drop the column `condition` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the `_PersonnelToTool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToTool` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Personnel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[personnelId]` on the table `Tool` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `conditionId` to the `Tool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PersonnelToTool" DROP CONSTRAINT "_PersonnelToTool_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonnelToTool" DROP CONSTRAINT "_PersonnelToTool_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTool" DROP CONSTRAINT "_ProjectToTool_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTool" DROP CONSTRAINT "_ProjectToTool_B_fkey";

-- AlterTable
ALTER TABLE "Personnel" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "condition",
DROP COLUMN "status",
ADD COLUMN     "conditionId" INTEGER NOT NULL,
ADD COLUMN     "personnelId" INTEGER,
ADD COLUMN     "projectId" INTEGER,
ADD COLUMN     "statusId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PersonnelToTool";

-- DropTable
DROP TABLE "_ProjectToTool";

-- DropEnum
DROP TYPE "ConditionTypes";

-- DropEnum
DROP TYPE "StatusTypes";

-- CreateTable
CREATE TABLE "ConditionType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConditionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatusType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConditionType_name_key" ON "ConditionType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StatusType_name_key" ON "StatusType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Personnel_userId_key" ON "Personnel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_personnelId_key" ON "Tool"("personnelId");

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "ConditionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personnel" ADD CONSTRAINT "Personnel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
