-- CreateTable
CREATE TABLE "ToolRequest" (
    "id" SERIAL NOT NULL,
    "toolId" INTEGER NOT NULL,
    "personnelId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolRepairRequest" (
    "id" SERIAL NOT NULL,
    "toolId" INTEGER NOT NULL,
    "personnelId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolRepairRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ToolRequest" ADD CONSTRAINT "ToolRequest_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolRequest" ADD CONSTRAINT "ToolRequest_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolRepairRequest" ADD CONSTRAINT "ToolRepairRequest_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolRepairRequest" ADD CONSTRAINT "ToolRepairRequest_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
