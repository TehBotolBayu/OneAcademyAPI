/*
  Warnings:

  - Added the required column `title` to the `Chapters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapters" ADD COLUMN     "title" TEXT NOT NULL;
