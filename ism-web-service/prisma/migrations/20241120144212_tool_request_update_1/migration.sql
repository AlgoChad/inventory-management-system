-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "base64" TEXT NOT NULL,
    "toolRepairRequestId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_toolRepairRequestId_fkey" FOREIGN KEY ("toolRepairRequestId") REFERENCES "ToolRepairRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
