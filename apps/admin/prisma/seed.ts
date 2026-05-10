import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@carthousegh.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Admin'

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, password, name },
  })
  console.log(`Created admin: ${admin.email}`)

  const categories = [
    { name: 'Clothing', slug: 'clothing', children: ['Shirts', 'T-Shirts', 'Jeans', 'Hoodies'] },
    { name: 'Electronics', slug: 'electronics', children: ['Phones', 'Laptops', 'Accessories'] },
    { name: 'Home & Living', slug: 'home-living', children: ['Furniture', 'Kitchen', 'Decor'] },
  ]

  for (const cat of categories) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug },
    })
    for (const childName of cat.children) {
      const childSlug = childName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      await prisma.category.upsert({
        where: { slug: childSlug },
        update: {},
        create: { name: childName, slug: childSlug, parentId: parent.id },
      })
    }
  }
  console.log('Created default categories with subcategories')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })