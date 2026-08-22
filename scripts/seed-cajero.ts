import "dotenv/config";
import { nanoid } from "nanoid";
import { getDb } from "../server/config/db";
import { users } from "../drizzle/schema";
import { hashPassword } from "../server/_core/auth/password";

const EMAIL = process.env.SEED_CAJERO_EMAIL || "cajero@icvnl.gob.mx";
const EMPLOYEE_ID = process.env.SEED_CAJERO_EMPLOYEE_ID || "CAJERO001";
const PASSWORD = process.env.SEED_CAJERO_PASSWORD || "Demo@2026";

async function main() {
  const db = await getDb();
  if (!db) {
    console.error("No hay conexión a base de datos (DATABASE_URL). Abortando.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(PASSWORD);

  await db.insert(users).values({
    openId: nanoid(),
    name: "Cajero de Prueba",
    email: EMAIL,
    loginMethod: "institutional",
    passwordHash,
    role: "user",
    institutionalRole: "cajero",
    status: "active",
    institution: "ICVNL",
    employeeId: EMPLOYEE_ID,
  });

  console.log("Usuario cajero creado:");
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
