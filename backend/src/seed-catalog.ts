import prisma from './utils/prisma.js';

async function main() {
  const items = [
    { name: 'Premium Dinner Set', description: '24-piece premium ceramic set', category: 'Kitchen', price: 150 },
    { name: '4K Smart TV', description: '55-inch 4K UHD Smart LED TV', category: 'Electronics', price: 450 },
    { name: 'Espresso Machine', description: 'Automatic espresso and coffee machine', category: 'Kitchen', price: 120 },
    { name: 'Luxury Bed Sheets', description: 'Egyptian cotton 800 thread count', category: 'Home', price: 80 },
    { name: 'Mirrorless Camera', description: 'Digital mirrorless camera with 18-55mm lens', category: 'Electronics', price: 600 },
  ];

  for (const item of items) {
    const existing = await prisma.catalogItem.findFirst({ where: { name: item.name } });
    if (!existing) {
        await prisma.catalogItem.create({ data: item });
    }
  }
  console.log('Catalog seeded!');
}

main();
