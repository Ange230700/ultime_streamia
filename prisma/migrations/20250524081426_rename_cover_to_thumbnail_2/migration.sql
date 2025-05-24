/*
  Warnings:

  - You are about to drop the column `thumbnail_data` on the `video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `video` DROP COLUMN `thumbnail_data`,
    ADD COLUMN `thumbnail` BLOB NULL;
