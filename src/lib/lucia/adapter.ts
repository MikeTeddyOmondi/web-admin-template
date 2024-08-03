import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle"
import db from "../db"
import { sessions, users } from "../db/schema"

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users)

export default adapter
