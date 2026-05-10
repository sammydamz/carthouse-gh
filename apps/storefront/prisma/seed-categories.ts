import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: 'Phone Accessories', slug: 'phone-accessories' },
  { name: 'Computing', slug: 'computing' },
  { name: 'Kitchen Appliances', slug: 'kitchen-appliances' },
  { name: 'Home Appliances', slug: 'home-appliances' },
  { name: 'Clothing & Fabrics', slug: 'clothing-fabrics' },
]

const subCategories: Record<string, { name: string; slug: string }[]> = {
  'phone-accessories': [
    { name: 'Airpods', slug: 'airpods' },
    { name: 'Chargers', slug: 'chargers' },
    { name: 'Cables', slug: 'cables' },
    { name: 'Cases', slug: 'cases' },
    { name: 'Power Banks', slug: 'power-banks' },
  ],
  computing: [
    { name: 'Mifi Devices', slug: 'mifi-devices' },
    { name: 'Keyboard & Mouse', slug: 'keyboard-mouse' },
    { name: 'Laptop Chargers', slug: 'laptop-chargers' },
    { name: 'Laptop Stands', slug: 'laptop-stands' },
  ],
  'kitchen-appliances': [
    { name: 'Blenders', slug: 'blenders' },
    { name: 'Rice Cookers', slug: 'rice-cookers' },
    { name: 'Electric Cookers', slug: 'electric-cookers' },
    { name: 'Microwaves', slug: 'microwaves' },
  ],
  'home-appliances': [
    { name: 'Air Conditioners', slug: 'air-conditioners' },
    { name: 'Televisions', slug: 'televisions' },
    { name: 'Fans', slug: 'fans' },
    { name: 'Irons', slug: 'irons' },
    { name: 'Extension Boards', slug: 'extension-boards' },
  ],
  'clothing-fabrics': [
    { name: "Men's Wear", slug: 'mens-wear' },
    { name: "Women's Wear", slug: 'womens-wear' },
    { name: "Children's Wear", slug: 'childrens-wear' },
    { name: 'Fabrics', slug: 'fabrics' },
  ],
}

async function main() {
  for (const cat of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } })
    if (!existing) {
      const parent = await prisma.category.create({ data: cat })
      const subs = subCategories[cat.slug] || []
      for (const sub of subs) {
        await prisma.category.create({
          data: { ...sub, parentId: parent.id },
        })
      }
      console.log(`Created category: ${cat.name}`)
    }
  }
  console.log('Category seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })