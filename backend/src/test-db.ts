import prisma from './utils/prisma.js';

async function main() {
  try {
    console.log('Testing Prisma connection...');
    await prisma.$connect();
    console.log('Connection successful!');
    const users = await prisma.user.findMany();
    console.log('Users found:', users.length);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
