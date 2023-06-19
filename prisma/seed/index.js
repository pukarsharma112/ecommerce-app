import fs from "fs"
import { products } from "./data.js"
import { PrismaClient } from '@prisma/client';
import { createId } from "@paralleldrive/cuid2"

const prisma = new PrismaClient();

function makeData() {
	const data = products.map(product => {
		return product
	});

	const fileData = `export const products = ${JSON.stringify(data, null, 2)}`
	fs.writeFileSync("./prisma/temp.js", fileData)
}

async function seed() {
	await prisma.$transaction(products.map(data => prisma.product.create({ data })))
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });