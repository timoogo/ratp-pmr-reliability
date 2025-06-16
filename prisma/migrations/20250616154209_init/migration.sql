-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('ASCENSEUR', 'ESCALATOR', 'PORTILLONS', 'CABINES');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('DISPONIBLE', 'INDISPONIBLE', 'EN_MAINTENANCE');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('NOUVEAU', 'EN_COURS', 'RESOLU', 'REJETE');

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "line" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EquipmentType" NOT NULL,
    "status" "EquipmentStatus" NOT NULL,
    "code" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "displayHistory" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentHistory" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquipmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentCheck" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL,
    "agent" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquipmentCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentRepair" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "repairedAt" TIMESTAMP(3) NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquipmentRepair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentReport" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'NOUVEAU',
    "equipmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Station_code_key" ON "Station"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Station_slug_key" ON "Station"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Station_order_key" ON "Station"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_code_key" ON "Equipment"("code");

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentHistory" ADD CONSTRAINT "EquipmentHistory_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentCheck" ADD CONSTRAINT "EquipmentCheck_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentRepair" ADD CONSTRAINT "EquipmentRepair_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentReport" ADD CONSTRAINT "IncidentReport_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
