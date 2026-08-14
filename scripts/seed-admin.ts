import "dotenv/config";
import { nanoid } from "nanoid";
import { getDb } from "../server/config/db";
import { users } from "../drizzle/schema";
import { hashPassword } from "../server/_core/auth/password";

const EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@icvnl.gob.mx";
const EMPLOYEE_ID = process.env.SEED_ADMIN_EMPLOYEE_ID || "ADMIN001";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Demo@2026";

async function main() {
  const db = await getDb();
  if (!db) {
    console.error("No hay conexión a base de datos (DATABASE_URL). Abortando.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(PASSWORD);

  await db.insert(users).values({
    openId: nanoid(),
    name: "Administrador ICVNL",
    email: EMAIL,
    loginMethod: "institutional",
    passwordHash,
    role: "admin",
    institutionalRole: "admin",
    status: "active",
    institution: "ICVNL",
    employeeId: EMPLOYEE_ID,
  });

  console.log("Usuario admin creado:");
  console.log(`  Email:       ${EMAIL}`);
  console.log(`  Employee ID: ${EMPLOYEE_ID}`);
  console.log(`  Password:    ${PASSWORD}`);
  console.log("\nIMPORTANTE: cambiar esta contraseña antes de producción.");
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
