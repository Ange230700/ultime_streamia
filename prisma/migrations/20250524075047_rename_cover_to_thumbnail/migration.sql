/*
  Warnings:

  - You are about to drop the column `card_image_data` on the `video` table. All the data in the column will be lost.
  - You are about to drop the column `cover_image_data` on the `video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `video` DROP COLUMN `card_image_data`,
    DROP COLUMN `cover_image_data`,
    ADD COLUMN `thumbnail_data` BLOB NULL;
