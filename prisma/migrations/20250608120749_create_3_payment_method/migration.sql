-- AlterTable
ALTER TABLE `order` ADD COLUMN `paymentType` ENUM('COD', 'VNPAY', 'MOMO') NOT NULL DEFAULT 'COD';
