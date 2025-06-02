-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `home_store` INTEGER NULL,
    `customer_since` DATETIME(3) NULL,
    `loyalty_card_number` VARCHAR(191) NULL,
    `birthdate` DATETIME(3) NULL,
    `gender` VARCHAR(191) NULL,
    `birth_year` INTEGER NULL,

    UNIQUE INDEX `users_email_key`(`email`),
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

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Staff` (
    `staff_id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `location` VARCHAR(191) NULL,

    PRIMARY KEY (`staff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sale_Outlet` (
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

    PRIMARY KEY (`sales_outlet_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sales_Target` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sales_outlet_id` INTEGER NOT NULL,
    `year_month` VARCHAR(191) NULL,
    `beans_goal` INTEGER NULL,
    `beverage_goal` INTEGER NULL,
    `food_goal` INTEGER NULL,
    `merchandise _goal` INTEGER NOT NULL,
    `total_goal` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pastry_Inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sales_outlet_id` INTEGER NOT NULL,
    `transaction_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `product_id` INTEGER NOT NULL,
    `start_of_day` INTEGER NULL,
    `quantity_sold` INTEGER NULL,
    `waste` INTEGER NULL,
    `% waste` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DateInfo` (
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
CREATE TABLE `SalesReceipt` (
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

    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_home_store_fkey` FOREIGN KEY (`home_store`) REFERENCES `Sale_Outlet`(`sales_outlet_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale_Outlet` ADD CONSTRAINT `Sale_Outlet_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `Staff`(`staff_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sales_Target` ADD CONSTRAINT `Sales_Target_sales_outlet_id_fkey` FOREIGN KEY (`sales_outlet_id`) REFERENCES `Sale_Outlet`(`sales_outlet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pastry_Inventory` ADD CONSTRAINT `Pastry_Inventory_sales_outlet_id_fkey` FOREIGN KEY (`sales_outlet_id`) REFERENCES `Sale_Outlet`(`sales_outlet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pastry_Inventory` ADD CONSTRAINT `Pastry_Inventory_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReceipt` ADD CONSTRAINT `SalesReceipt_sales_outlet_id_fkey` FOREIGN KEY (`sales_outlet_id`) REFERENCES `Sale_Outlet`(`sales_outlet_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReceipt` ADD CONSTRAINT `SalesReceipt_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `Staff`(`staff_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReceipt` ADD CONSTRAINT `SalesReceipt_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesReceipt` ADD CONSTRAINT `SalesReceipt_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
