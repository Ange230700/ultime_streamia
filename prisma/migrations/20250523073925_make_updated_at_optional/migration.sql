/*
  Warnings:

  - A unique constraint covering the columns `[category_name]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[category_id,video_id]` on the table `category_video` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,video_id]` on the table `favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[video_title,release_date]` on the table `video` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,video_id]` on the table `watchlist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[watchlist_id,video_id]` on the table `watchlist_video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `category` table without a default value. This is not possible if the table is not empty.
  - Made the column `category_id` on table `category_video` required. This step will fail if there are existing NULL values in that column.
  - Made the column `video_id` on table `category_video` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `category_video` DROP FOREIGN KEY `category_video_category_id_foreign`;

-- DropForeignKey
ALTER TABLE `category_video` DROP FOREIGN KEY `category_video_video_id_foreign`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_user_id_foreign`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_video_id_foreign`;

-- DropForeignKey
ALTER TABLE `favorite` DROP FOREIGN KEY `favorite_user_id_foreign`;

-- DropForeignKey
ALTER TABLE `favorite` DROP FOREIGN KEY `favorite_video_id_foreign`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_avatar_id_foreign`;

-- DropForeignKey
ALTER TABLE `watchlist` DROP FOREIGN KEY `watchlist_user_id_foreign`;

-- DropForeignKey
ALTER TABLE `watchlist_video` DROP FOREIGN KEY `watchlist_video_video_id_foreign`;

-- DropForeignKey
ALTER TABLE `watchlist_video` DROP FOREIGN KEY `watchlist_video_watchlist_id_foreign`;

-- DropIndex
DROP INDEX `user_avatar_id_foreign` ON `user`;

-- AlterTable
ALTER TABLE `avatar` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `category_video` MODIFY `category_id` BIGINT UNSIGNED NOT NULL,
    MODIFY `video_id` BIGINT UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `written_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `favorite` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `video` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `release_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `category_category_name_key` ON `category`(`category_name`);

-- CreateIndex
CREATE UNIQUE INDEX `category_video_category_id_video_id_key` ON `category_video`(`category_id`, `video_id`);

-- CreateIndex
CREATE UNIQUE INDEX `favorite_user_id_video_id_key` ON `favorite`(`user_id`, `video_id`);

-- CreateIndex
CREATE INDEX `refresh_token_expires_at_idx` ON `refresh_token`(`expires_at`);

-- CreateIndex
CREATE INDEX `video_release_date_idx` ON `video`(`release_date`);

-- CreateIndex
CREATE UNIQUE INDEX `video_video_title_release_date_key` ON `video`(`video_title`, `release_date`);

-- CreateIndex
CREATE UNIQUE INDEX `watchlist_user_id_video_id_key` ON `watchlist`(`user_id`, `video_id`);

-- CreateIndex
CREATE UNIQUE INDEX `watchlist_video_watchlist_id_video_id_key` ON `watchlist_video`(`watchlist_id`, `video_id`);

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_avatar_id_fkey` FOREIGN KEY (`avatar_id`) REFERENCES `avatar`(`avatar_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_video` ADD CONSTRAINT `category_video_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category_video` ADD CONSTRAINT `category_video_video_id_fkey` FOREIGN KEY (`video_id`) REFERENCES `video`(`video_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_video_id_fkey` FOREIGN KEY (`video_id`) REFERENCES `video`(`video_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_video_id_fkey` FOREIGN KEY (`video_id`) REFERENCES `video`(`video_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `watchlist` ADD CONSTRAINT `watchlist_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `watchlist_video` ADD CONSTRAINT `watchlist_video_watchlist_id_fkey` FOREIGN KEY (`watchlist_id`) REFERENCES `watchlist`(`watchlist_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `watchlist_video` ADD CONSTRAINT `watchlist_video_video_id_fkey` FOREIGN KEY (`video_id`) REFERENCES `video`(`video_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `category_video_category_id_idx` ON `category_video`(`category_id`);
DROP INDEX `category_video_category_id_foreign` ON `category_video`;

-- RedefineIndex
CREATE INDEX `category_video_video_id_idx` ON `category_video`(`video_id`);
DROP INDEX `category_video_video_id_foreign` ON `category_video`;

-- RedefineIndex
CREATE INDEX `comment_user_id_idx` ON `comment`(`user_id`);
DROP INDEX `comment_user_id_foreign` ON `comment`;

-- RedefineIndex
CREATE INDEX `comment_video_id_idx` ON `comment`(`video_id`);
DROP INDEX `comment_video_id_foreign` ON `comment`;

-- RedefineIndex
CREATE INDEX `favorite_user_id_idx` ON `favorite`(`user_id`);
DROP INDEX `favorite_user_id_foreign` ON `favorite`;

-- RedefineIndex
CREATE INDEX `favorite_video_id_idx` ON `favorite`(`video_id`);
DROP INDEX `favorite_video_id_foreign` ON `favorite`;

-- RedefineIndex
CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);
DROP INDEX `user_email_unique` ON `user`;

-- RedefineIndex
CREATE INDEX `watchlist_user_id_idx` ON `watchlist`(`user_id`);
DROP INDEX `watchlist_user_id_foreign` ON `watchlist`;

-- RedefineIndex
CREATE INDEX `watchlist_video_video_id_idx` ON `watchlist_video`(`video_id`);
DROP INDEX `watchlist_video_video_id_foreign` ON `watchlist_video`;

-- RedefineIndex
CREATE INDEX `watchlist_video_watchlist_id_idx` ON `watchlist_video`(`watchlist_id`);
DROP INDEX `watchlist_video_watchlist_id_foreign` ON `watchlist_video`;
