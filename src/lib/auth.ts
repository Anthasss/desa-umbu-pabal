import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "../db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [
    admin(),
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.email === "admin@umbupabal.com") {
            return { data: { ...user, role: "admin" } };
          }
          return { data: user };
        },
      },
    },
  },
});
