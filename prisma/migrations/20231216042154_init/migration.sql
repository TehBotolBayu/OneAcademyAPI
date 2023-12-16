/*
  Warnings:

  - The primary key for the `Course_Progress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Course_Progress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course_Progress" DROP CONSTRAINT "Course_Progress_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Course_Progress_pkey" PRIMARY KEY ("userId", "materialId");
