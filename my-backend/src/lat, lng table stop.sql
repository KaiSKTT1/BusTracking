ALTER TABLE `stop`
ADD COLUMN `lat` DECIMAL(10, 8) NULL DEFAULT NULL AFTER `address`,
ADD COLUMN `lng` DECIMAL(11, 8) NULL DEFAULT NULL AFTER `lat`;

UPDATE `stop` SET `lat` = 10.77500000, `lng` = 106.70000000 WHERE `stop_id` = 1;
UPDATE `stop` SET `lat` = 10.75800000, `lng` = 106.67800000 WHERE `stop_id` = 2;
UPDATE `stop` SET `lat` = 10.78000000, `lng` = 106.68700000 WHERE `stop_id` = 3;
UPDATE `stop` SET `lat` = 10.76200000, `lng` = 106.68000000 WHERE `stop_id` = 4;
UPDATE `stop` SET `lat` = 10.79600000, `lng` = 106.70900000 WHERE `stop_id` = 5;
UPDATE `stop` SET `lat` = 10.80300000, `lng` = 106.63800000 WHERE `stop_id` = 6;
UPDATE `stop` SET `lat` = 10.80600000, `lng` = 106.64900000 WHERE `stop_id` = 7;
UPDATE `stop` SET `lat` = 10.75000000, `lng` = 106.69000000 WHERE `stop_id` = 8;
UPDATE `stop` SET `lat` = 10.80000000, `lng` = 106.64300000 WHERE `stop_id` = 9;
UPDATE `stop` SET `lat` = 10.76800000, `lng` = 106.65400000 WHERE `stop_id` = 10;