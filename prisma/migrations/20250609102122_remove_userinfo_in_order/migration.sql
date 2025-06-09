/*
  Warnings:

  - You are about to drop the column `userInfoId` on the `order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userInfoId_fkey`;

-- DropIndex
DROP INDEX `Order_userInfoId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `userInfoId`;
