-- CreateTable
CREATE TABLE "ConditionType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StatusType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "toolNumber" TEXT NOT NULL,
    "toolDescription" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "conditionId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "projectId" INTEGER,
    "personnelId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tool_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "ConditionType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tool_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tool_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tool_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "Personnel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectDescription" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Checkin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "toolId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Checkin_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Checkin_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Personnel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Personnel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ConditionType_name_key" ON "ConditionType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StatusType_name_key" ON "StatusType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_toolNumber_key" ON "Tool"("toolNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Personnel_userId_key" ON "Personnel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
