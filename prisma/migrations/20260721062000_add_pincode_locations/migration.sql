-- CreateTable
CREATE TABLE `PincodeLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pincode` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PincodeLocation_pincode_idx`(`pincode`),
    INDEX `PincodeLocation_district_idx`(`district`),
    INDEX `PincodeLocation_state_idx`(`state`),
    UNIQUE INDEX `PincodeLocation_pincode_city_district_state_key`(`pincode`, `city`, `district`, `state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
