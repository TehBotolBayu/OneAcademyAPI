/*
  Warnings:

  - Added the required column `chapterId` to the `Materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `step` to the `Materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Materials" ADD COLUMN     "chapterId" TEXT NOT NULL,
ADD COLUMN     "step" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Chapters" (
    "id" TEXT NOT NULL,
    "totalDuration" INTEGER NOT NULL,
    "step" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Materials" ADD CONSTRAINT "Materials_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
