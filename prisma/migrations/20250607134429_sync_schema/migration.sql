-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `home_store` INTEGER NULL,
    `customer_since` DATETIME(3) NULL,
    `loyalty_card_number` VARCHAR(191) NULL,
    `birthdate` DATETIME(3) NULL,
    `gender` VARCHAR(191) NULL,
    `birth_year` INTEGER NULL,
    `picture` VARCHAR(191) NULL DEFAULT 'https://res.cloudinary.com/dj9r2qksh/image/upload/v1740839376/newspaper_images/hhbo5chxdtudnaliaiqx.jpg',
    `provider` VARCHAR(191) NULL DEFAULT 'LOCAL',
    `providerId` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_home_store_fkey`(`home_store`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedbacks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `type` ENUM('REVIEW', 'COMPLAINT', 'SUGGESTION', 'COMPLIMENT') NOT NULL DEFAULT 'REVIEW',
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN') NOT NULL DEFAULT 'PENDING',
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `feedbacks_productId_idx`(`productId`),
    INDEX `feedbacks_userId_idx`(`userId`),
    INDEX `feedbacks_rating_idx`(`rating`),
    INDEX `feedbacks_createdAt_idx`(`createdAt`),
    UNIQUE INDEX `feedbacks_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dateinfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `week_id` INTEGER NOT NULL,
    `week_desc` VARCHAR(191) NOT NULL,
    `month_id` INTEGER NOT NULL,
    `month_name` VARCHAR(191) NOT NULL,
    `quarter_id` INTEGER NOT NULL,
    `quarter_name` VARCHAR(191) NOT NULL,
    `year_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL DEFAULT 'https://res.cloudinary.com/dj9r2qksh/image/upload/v1748052303/coffee-6467644_1280_hhpgwj.jpg',
    `publicId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pastry_inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sales_outlet_id` INTEGER NOT NULL,
    `transaction_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `product_id` INTEGER NOT NULL,
    `start_of_day` INTEGER NULL,
    `quantity_sold` INTEGER NULL,
    `waste` INTEGER NULL,

    INDEX `Pastry_Inventory_product_id_fkey`(`product_id`),
    INDEX `Pastry_Inventory_sales_outlet_id_fkey`(`sales_outlet_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_group` VARCHAR(191) NULL,
    `product_category` VARCHAR(191) NULL,
    `product_type` VARCHAR(191) NULL,
    `product` VARCHAR(191) NULL,
    `product_description` VARCHAR(191) NULL,
    `unit_of_measure` VARCHAR(191) NULL,
    `current_wholesale_price` DOUBLE NULL,
    `current_retail_price` DOUBLE NULL,
    `tax_exempt_yn` BOOLEAN NULL,
    `promo_yn` BOOLEAN NULL,
    `new_product_yn` BOOLEAN NULL,
    `imageId` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `stock` INTEGER NOT NULL DEFAULT 10,

    INDEX `Product_imageId_fkey`(`imageId`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productimage` (
    `productId` INTEGER NOT NULL,
    `imageId` INTEGER NOT NULL,

    INDEX `ProductImage_imageId_fkey`(`imageId`),
    PRIMARY KEY (`productId`, `imageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale_outlet` (
    `sales_outlet_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sales_outlet_type` VARCHAR(191) NULL,
    `store_square_feet` INTEGER NULL,
    `store_address` VARCHAR(191) NULL,
    `store_city` VARCHAR(191) NULL,
    `store_state_province` VARCHAR(191) NULL,
    `store_telephone` VARCHAR(191) NULL,
    `store_postal_code` VARCHAR(191) NULL,
    `store_longitude` DOUBLE NULL,
    `store_latitude` DOUBLE NULL,
    `manager_id` INTEGER NULL,
    `Neighorhood` VARCHAR(191) NOT NULL,

    INDEX `Sale_Outlet_manager_id_fkey`(`manager_id`),
    PRIMARY KEY (`sales_outlet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales_target` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sales_outlet_id` INTEGER NOT NULL,
    `year_month` VARCHAR(191) NULL,
    `beans_goal` INTEGER NULL,
    `beverage_goal` INTEGER NULL,
    `food_goal` INTEGER NULL,
    `merchandise _goal` INTEGER NOT NULL,
    `total_goal` INTEGER NULL,

    INDEX `Sales_Target_sales_outlet_id_fkey`(`sales_outlet_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salesreceipt` (
    `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_date` DATETIME(3) NOT NULL,
    `transaction_time` DATETIME(3) NOT NULL,
    `sales_outlet_id` INTEGER NOT NULL,
    `staff_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `instore_yn` BOOLEAN NOT NULL,
    `order` INTEGER NOT NULL,
    `line_item_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `line_item_amount` DOUBLE NOT NULL,
    `unit_price` DOUBLE NOT NULL,
    `promo_item_yn` BOOLEAN NOT NULL,

    INDEX `SalesReceipt_product_id_fkey`(`product_id`),
    INDEX `SalesReceipt_sales_outlet_id_fkey`(`sales_outlet_id`),
    INDEX `SalesReceipt_staff_id_fkey`(`staff_id`),
    INDEX `SalesReceipt_user_id_fkey`(`user_id`),
    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staff` (
    `staff_id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `location` VARCHAR(191) NULL,

    PRIMARY KEY (`staff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `ward` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `totalAmount` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `userId` INTEGER NULL,
    `userInfoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_home_store_fkey` FOREIGN KEY (`home_store`) REFERENCES `sale_outlet`(`sales_outlet_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pastry_inventory` ADD CONSTRAINT `Pastry_Inventory_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pastry_inventory` ADD CONSTRAINT `Pastry_Inventory_sales_outlet_id_fkey` FOREIGN KEY (`sales_outlet_id`) REFERENCES `sale_outlet`(`sales_outlet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productimage` ADD CONSTRAINT `ProductImage_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `image`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productimage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_outlet` ADD CONSTRAINT `Sale_Outlet_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `staff`(`staff_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales_target` ADD CONSTRAINT `Sales_Target_sales_outlet_id_fkey` FOREIGN KEY (`sales_outlet_id`) REFERENCES `sale_outlet`(`sales_outlet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salesreceipt` ADD CONSTRAINT `SalesReceipt_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salesreceipt` ADD CONSTRAINT `SalesReceipt_sales_outlet_id_fkey` FOREIGN KEY (`sales_outlet_id`) REFERENCES `sale_outlet`(`sales_outlet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salesreceipt` ADD CONSTRAINT `SalesReceipt_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`staff_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salesreceipt` ADD CONSTRAINT `SalesReceipt_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInfo` ADD CONSTRAINT `UserInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userInfoId_fkey` FOREIGN KEY (`userInfoId`) REFERENCES `UserInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
