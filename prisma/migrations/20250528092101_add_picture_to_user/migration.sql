-- AlterTable
ALTER TABLE `users` ADD COLUMN `picture` VARCHAR(191) NULL DEFAULT 'https://res.cloudinary.com/dj9r2qksh/image/upload/v1740839376/newspaper_images/hhbo5chxdtudnaliaiqx.jpg',
    MODIFY `hash` VARCHAR(191) NULL;
