import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@carthousegh.com'
  const existing = await prisma.admin.findUnique({ where: { email } })

  if (!existing) {
    await prisma.admin.create({
      data: {
        email,
        password: 'admin123', // Change this in production!
        name: 'Admin',
      },
    })
    console.log('Admin user created: admin@carthousegh.com / admin123')
  } else {
    console.log('Admin user already exists')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })