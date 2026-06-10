const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./node_modules/.prisma/client');

const connectionString = "postgresql://neondb_owner:npg_V58gYFmBOPda@ep-royal-glade-ac55fitc-pooler.sa-east-1.aws.neon.tech/si2?sslmode=require";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("=== ORDENES DE COMPRA ===");
    const orders = await prisma.ordenCompra.findMany({
      include: { Detalle_OC: true }
    });
    console.log(JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error("QUERY ERROR:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
