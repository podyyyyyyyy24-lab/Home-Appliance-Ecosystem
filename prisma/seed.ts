import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const provincesData = [
    { name: 'القاهرة والجيزة', shippingFee: 50 },
    { name: 'الإسكندرية', shippingFee: 70 },
    { name: 'محافظات الدلتا', shippingFee: 80 },
    { name: 'محافظات الصعيد', shippingFee: 100 },
    { name: 'محافظات القناة وسيناء', shippingFee: 120 },
  ]

  console.log('Start seeding provinces ...')
  for (const p of provincesData) {
    const province = await prisma.province.upsert({
      where: { name: p.name },
      update: { shippingFee: p.shippingFee },
      create: p,
    })
    console.log(`Created/Updated province: ${province.name}`)
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
