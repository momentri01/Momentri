import prisma from './utils/prisma.js';
import bcrypt from 'bcryptjs';
import { Role } from './types/prisma.js';

async function main() {
  const email = 'admin@momentris.com';
  const password = 'Adminpass123';
  const fullName = 'Platform Admin';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin user already exists.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      email,
      fullName,
      passwordHash,
      role: Role.ADMIN,
    }
  });

  console.log(`Admin user created: ${user.email}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
