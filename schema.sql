CREATE TABLE IF NOT EXISTS `schedule_last_run` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `last_run` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT IGNORE INTO `schedule_last_run` (`id`, `name`, `last_run`) VALUES
(1, 'stackoverflow', NOW());

CREATE TABLE IF NOT EXISTS `typo3_blogs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `source` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `beers` (
  `user_id` varchar(255) NOT NULL,
  `beer_count` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `schedule_last_run` ADD PRIMARY KEY (`id`);

ALTER TABLE `typo3_blogs` ADD PRIMARY KEY (`id`);

ALTER TABLE `schedule_last_run` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `typo3_blogs` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `beers` ADD PRIMARY KEY (`user_id`);