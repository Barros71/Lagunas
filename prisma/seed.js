const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar se admin já existe
    const existingAdmin = await prisma.client.findFirst({
      where: { name: 'don', isAdmin: true }
    });

    if (existingAdmin) {
      console.log('Admin "don" já existe no banco de dados.');
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash('lagunas123', 10);

    // Criar admin
    const admin = await prisma.client.create({
      data: {
        name: 'don',
        phone: '+55 35 99132-9573',
        password: hashedPassword,
        isAdmin: true
      }
    });

    console.log('Admin criado com sucesso:', admin);
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
