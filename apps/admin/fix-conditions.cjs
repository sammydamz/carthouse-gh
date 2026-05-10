const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const r1 = await prisma.car.updateMany({ where: { condition: 'New' }, data: { condition: 'Brand New' } });
  const r2 = await prisma.car.updateMany({ where: { condition: 'Used' }, data: { condition: 'Local Used' } });
  console.log('Updated New -> Brand New:', r1.count);
  console.log('Updated Used -> Local Used:', r2.count);
  await prisma.$disconnect();
}
main();
