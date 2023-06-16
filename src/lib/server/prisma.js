import { PrismaClient } from "@prisma/client";

export const prisma = globalThis.$$prisma || new PrismaClient();
if (!import.meta.env.PROD) globalThis.$$prisma = prisma;
