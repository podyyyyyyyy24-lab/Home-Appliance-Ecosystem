import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const couriers = await prisma.courier.findMany()
  console.log(JSON.stringify(couriers, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
