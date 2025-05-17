-- CreateTable
CREATE TABLE `avatar` (
    `avatar_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `image_data` BLOB NULL,

    PRIMARY KEY (`avatar_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `category_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_video` (
    `category_video_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` BIGINT UNSIGNED NULL,
    `video_id` BIGINT UNSIGNED NULL,

    INDEX `category_video_category_id_foreign`(`category_id`),
    INDEX `category_video_video_id_foreign`(`video_id`),
    PRIMARY KEY (`category_video_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `comment_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `video_id` BIGINT UNSIGNED NOT NULL,
    `comment_content` TEXT NOT NULL,
    `written_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `comment_user_id_foreign`(`user_id`),
    INDEX `comment_video_id_foreign`(`video_id`),
    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorite` (
    `favorite_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `video_id` BIGINT UNSIGNED NOT NULL,

    INDEX `favorite_user_id_foreign`(`user_id`),
    INDEX `favorite_video_id_foreign`(`video_id`),
    PRIMARY KEY (`favorite_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `avatar_id` BIGINT UNSIGNED NOT NULL,

    UNIQUE INDEX `user_email_unique`(`email`),
    INDEX `user_avatar_id_foreign`(`avatar_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `video` (
    `video_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `video_title` VARCHAR(255) NOT NULL,
    `video_description` TEXT NULL,
    `card_image_data` BLOB NULL,
    `cover_image_data` BLOB NULL,
    `video_data` BLOB NULL,
    `video_duration` TIME(0) NULL,
    `release_date` DATETIME(0) NOT NULL,
    `is_available` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`video_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `watchlist` (
    `watchlist_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `video_id` BIGINT UNSIGNED NOT NULL,

    INDEX `watchlist_user_id_foreign`(`user_id`),
    PRIMARY KEY (`watchlist_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `watchlist_video` (
    `watchlist_video_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `watchlist_id` BIGINT UNSIGNED NOT NULL,
    `video_id` BIGINT UNSIGNED NOT NULL,

    INDEX `watchlist_video_video_id_foreign`(`video_id`),
    INDEX `watchlist_video_watchlist_id_foreign`(`watchlist_id`),
    PRIMARY KEY (`watchlist_video_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `category_video` ADD CONSTRAINT `category_video_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `category_video` ADD CONSTRAINT `category_video_video_id_foreign` FOREIGN KEY (`video_id`) REFERENCES `video`(`video_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_video_id_foreign` FOREIGN KEY (`video_id`) REFERENCES `video`(`video_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_video_id_foreign` FOREIGN KEY (`video_id`) REFERENCES `video`(`video_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_avatar_id_foreign` FOREIGN KEY (`avatar_id`) REFERENCES `avatar`(`avatar_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `watchlist` ADD CONSTRAINT `watchlist_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `watchlist_video` ADD CONSTRAINT `watchlist_video_video_id_foreign` FOREIGN KEY (`video_id`) REFERENCES `video`(`video_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `watchlist_video` ADD CONSTRAINT `watchlist_video_watchlist_id_foreign` FOREIGN KEY (`watchlist_id`) REFERENCES `watchlist`(`watchlist_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
