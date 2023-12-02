/*
  Warnings:

  - Made the column `courseId` on table `Chapters` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `courseId` to the `Materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapters" ALTER COLUMN "courseId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Materials" ADD COLUMN     "courseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Materials" ADD CONSTRAINT "Materials_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
