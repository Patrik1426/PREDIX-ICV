CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`action` varchar(128) NOT NULL,
	`module` varchar(64) NOT NULL,
	`resource_id` varchar(255),
	`details` text,
	`ip_address` varchar(45),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role` enum('cajero','coordinador','director','admin') NOT NULL,
	`module` varchar(64) NOT NULL,
	`can_view` int NOT NULL DEFAULT 0,
	`can_edit` int NOT NULL DEFAULT 0,
	`can_delete` int NOT NULL DEFAULT 0,
	`can_export` int NOT NULL DEFAULT 0,
	CONSTRAINT `role_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `secret_audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`secret_id` int NOT NULL,
	`integration_id` varchar(64) NOT NULL,
	`user_id` int NOT NULL,
	`action` enum('CREATE','READ','UPDATE','DELETE','ROTATE','EXPORT') NOT NULL,
	`status` enum('SUCCESS','FAILED','DENIED') NOT NULL,
	`reason` varchar(255),
	`ip_address` varchar(45),
	`user_agent` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `secret_audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `secret_rotation_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`secret_id` int NOT NULL,
	`integration_id` varchar(64) NOT NULL,
	`rotation_type` enum('AUTOMATIC','MANUAL','EMERGENCY') NOT NULL,
	`old_value_hash` varchar(255) NOT NULL,
	`new_value_hash` varchar(255) NOT NULL,
	`rotated_by` int,
	`reason` text,
	`status` enum('PENDING','IN_PROGRESS','COMPLETED','FAILED') NOT NULL DEFAULT 'PENDING',
	`error_message` text,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `secret_rotation_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `secret_vault` (
	`id` int AUTO_INCREMENT NOT NULL,
	`integration_id` varchar(64) NOT NULL,
	`secret_name` varchar(255) NOT NULL,
	`secret_type` enum('API_KEY','OAUTH_TOKEN','BASIC_AUTH','CERTIFICATE','CUSTOM') NOT NULL,
	`encrypted_value` text NOT NULL,
	`encryption_algorithm` varchar(50) NOT NULL DEFAULT 'AES-256-GCM',
	`encryption_iv` varchar(255) NOT NULL,
	`encryption_auth_tag` varchar(255) NOT NULL,
	`expires_at` timestamp,
	`rotation_interval` int,
	`last_rotated_at` timestamp,
	`next_rotation_at` timestamp,
	`is_active` int NOT NULL DEFAULT 1,
	`created_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `secret_vault_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`password_hash` varchar(255),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`institutional_role` enum('cajero','coordinador','director','admin') NOT NULL DEFAULT 'cajero',
	`status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
	`institution` varchar(255),
	`department` varchar(255),
	`employee_id` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `idx_audit_timestamp` ON `audit_log` (`timestamp`);--> statement-breakpoint
CREATE INDEX `idx_audit_user` ON `audit_log` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_role_module` ON `role_permissions` (`role`,`module`);