/*
  Warnings:

  - Added the required column `quantity` to the `ToolRepairRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ToolRepairRequest" ADD COLUMN     "quantity" INTEGER NOT NULL;
