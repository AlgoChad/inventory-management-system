/*
  Warnings:

  - Changed the type of `name` on the `UserRole` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('ADMIN', 'WAREHOUSE_MANAGER', 'WORKER', 'SUPERVISOR', 'ACCOUNTANT', 'ENGINEER', 'FOREMAN', 'SAFETY_OFFICER', 'HR_MANAGER', 'PROCUREMENT_OFFICER', 'SITE_MANAGER', 'PROJECT_MANAGER');

-- AlterTable
ALTER TABLE "UserRole" DROP COLUMN "name",
ADD COLUMN     "name" "RoleName" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_name_key" ON "UserRole"("name");
