export function getDrizzleSchemaTemplate(database: string): string {
  const tableFunc =
    database === "postgresql"
      ? "pgTable"
      : database === "mysql"
      ? "mysqlTable"
      : "sqliteTable";

  return `
// Auth tables (added by @sidgaikwad/auth-setup)
export const user = ${tableFunc}("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
})

export const session = ${tableFunc}("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id),
})

export const account = ${tableFunc}("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  password: text("password"),
})

export const verification = ${tableFunc}("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
})
`;
}

export function getPrismaSchemaTemplate(): string {
  return `
// Auth tables (added by @sidgaikwad/auth-setup)
model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}

model Account {
  id           String    @id
  accountId    String
  providerId   String
  userId       String
  user         User      @relation(fields: [userId], references: [id])
  accessToken  String?
  refreshToken String?
  idToken      String?
  expiresAt    DateTime?
  password     String?
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
}
`;
}
