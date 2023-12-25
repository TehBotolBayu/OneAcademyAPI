/*
  Warnings:

  - You are about to drop the column `courseId` on the `Materials` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `Chapters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Materials" DROP CONSTRAINT "Materials_courseId_fkey";

-- AlterTable
ALTER TABLE "Chapters" ADD COLUMN     "courseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Materials" DROP COLUMN "courseId",
ADD COLUMN     "coursesId" TEXT;

-- AddForeignKey
ALTER TABLE "Chapters" ADD CONSTRAINT "Chapters_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
