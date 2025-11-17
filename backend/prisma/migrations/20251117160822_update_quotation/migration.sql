/*
  Warnings:

  - You are about to drop the column `clientId` on the `Quotation` table. All the data in the column will be lost.
  - Added the required column `clientEmail` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `Quotation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "clientId",
ADD COLUMN     "clientEmail" TEXT NOT NULL,
ADD COLUMN     "clientName" TEXT NOT NULL;
