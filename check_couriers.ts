import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.courier.count()
  const names = await prisma.courier.findMany({ select: { name: true } })
  console.log('Count:', count)
  console.log('Names:', names.map(n => n.name).join(', '))
}

main().catch(console.error).finally(() => prisma.$disconnect())
