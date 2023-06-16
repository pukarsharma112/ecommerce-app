import { products } from "./data.js"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeData() {
	// const data = products.map(product => product);

	// const fileData = `export const products = ${JSON.stringify(data, null, 2)}`
	// fs.writeFileSync("./prisma/temp.js", fileData)

}

async function seed() {
	for(const product of products) {
		await prisma.product.create({data:product})
	}
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });