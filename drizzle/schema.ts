import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  /** Identificador único interno del usuario (no depende de ningún proveedor externo). */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  /** Hash bcrypt de la contraseña. Null hasta que se le asigne una (ver scripts/seed-passwords.ts). */
  passwordHash: varchar("password_hash", { length: 255 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Roles institucionales del ICVNL (ver docs/CUESTIONARIO_DIMENSIONAMIENTO_ICVNL.md Bloque 7.4).
  institutionalRole: mysqlEnum("institutional_role", ["cajero", "coordinador", "director", "admin"]).notNull().default("cajero"),
  status: mysqlEnum("status", ["active", "inactive", "suspended"]).default("active").notNull(),
  institution: varchar("institution", { length: 255 }),
  department: varchar("department", { length: 255 }),
  employeeId: varchar("employee_id", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Module access permissions by role
export const rolePermissions = mysqlTable("role_permissions", {
  id: int("id").autoincrement().primaryKey(),
  role: mysqlEnum("role", ["cajero", "coordinador", "director", "admin"]).notNull(),
  module: varchar("module", { length: 64 }).notNull(),
  canView: int("can_view").default(0).notNull(),
  canEdit: int("can_edit").default(0).notNull(),
  canDelete: int("can_delete").default(0).notNull(),
  canExport: int("can_export").default(0).notNull(),
}, (t) => [
  index("idx_role_module").on(t.role, t.module),
]);

export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = typeof rolePermissions.$inferInsert;

export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  action: varchar("action", { length: 128 }).notNull(),
  module: varchar("module", { length: 64 }).notNull(),
  resourceId: varchar("resource_id", { length: 255 }),
  details: text("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (t) => [
  index("idx_audit_timestamp").on(t.timestamp),
  index("idx_audit_user").on(t.userId),
]);

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;

// Vault for storing encrypted credentials (AES-256-GCM, ver server/services/vault/)
export const secretVault = mysqlTable("secret_vault", {
  id: int("id").autoincrement().primaryKey(),
  integrationId: varchar("integration_id", { length: 64 }).notNull(),
  secretName: varchar("secret_name", { length: 255 }).notNull(),
  secretType: mysqlEnum("secret_type", ["API_KEY", "OAUTH_TOKEN", "BASIC_AUTH", "CERTIFICATE", "CUSTOM"]).notNull(),
  encryptedValue: text("encrypted_value").notNull(),
  encryptionAlgorithm: varchar("encryption_algorithm", { length: 50 }).default("AES-256-GCM").notNull(),
  encryptionIv: varchar("encryption_iv", { length: 255 }).notNull(),
  encryptionAuthTag: varchar("encryption_auth_tag", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at"),
  rotationInterval: int("rotation_interval"),
  lastRotatedAt: timestamp("last_rotated_at"),
  nextRotationAt: timestamp("next_rotation_at"),
  isActive: int("is_active").default(1).notNull(),
  createdBy: int("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SecretVault = typeof secretVault.$inferSelect;
export type InsertSecretVault = typeof secretVault.$inferInsert;

export const secretAuditLog = mysqlTable("secret_audit_log", {
  id: int("id").autoincrement().primaryKey(),
  secretId: int("secret_id").notNull(),
  integrationId: varchar("integration_id", { length: 64 }).notNull(),
  userId: int("user_id").notNull(),
  action: mysqlEnum("action", ["CREATE", "READ", "UPDATE", "DELETE", "ROTATE", "EXPORT"]).notNull(),
  status: mysqlEnum("status", ["SUCCESS", "FAILED", "DENIED"]).notNull(),
  reason: varchar("reason", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type SecretAuditLog = typeof secretAuditLog.$inferSelect;
export type InsertSecretAuditLog = typeof secretAuditLog.$inferInsert;

export const secretRotationHistory = mysqlTable("secret_rotation_history", {
  id: int("id").autoincrement().primaryKey(),
  secretId: int("secret_id").notNull(),
  integrationId: varchar("integration_id", { length: 64 }).notNull(),
  rotationType: mysqlEnum("rotation_type", ["AUTOMATIC", "MANUAL", "EMERGENCY"]).notNull(),
  oldValueHash: varchar("old_value_hash", { length: 255 }).notNull(),
  newValueHash: varchar("new_value_hash", { length: 255 }).notNull(),
  rotatedBy: int("rotated_by"),
  reason: text("reason"),
  status: mysqlEnum("status", ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"]).default("PENDING").notNull(),
  errorMessage: text("error_message"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SecretRotationHistory = typeof secretRotationHistory.$inferSelect;
export type InsertSecretRotationHistory = typeof secretRotationHistory.$inferInsert;

// TODO: tablas de trámites/delegaciones/ventanillas/citas — pendientes de
// diseñar en cuanto el ICVNL responda el cuestionario de dimensionamiento
// (docs/CUESTIONARIO_DIMENSIONAMIENTO_ICVNL.md, Bloque 2). No inventar el
// esquema antes de tener el inventario real de sistemas/campos.
