/*
  Warnings:

  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToUserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserToUserRole" DROP CONSTRAINT "_UserToUserRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserRole" DROP CONSTRAINT "_UserToUserRole_B_fkey";

-- DropTable
DROP TABLE "UserRole";

-- DropTable
DROP TABLE "_UserToUserRole";

-- DropEnum
DROP TYPE "RoleName";
