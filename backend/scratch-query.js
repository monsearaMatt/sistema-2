const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./node_modules/.prisma/client');

const connectionString = "postgresql://neondb_owner:npg_V58gYFmBOPda@ep-royal-glade-ac55fitc-pooler.sa-east-1.aws.neon.tech/si2?sslmode=require";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("=== PRODUCTS ===");
    const products = await prisma.producto.findMany();
    console.log(JSON.stringify(products, null, 2));

    console.log("=== PICKING #4 and #5 ===");
    const pickings = await prisma.log_picking.findMany({
      where: { id_ot: { in: [4, 5] } }
    });
    console.log(JSON.stringify(pickings, null, 2));

    console.log("=== CLIENTS ===");
    const clients = await prisma.clientes.findMany();
    console.log(JSON.stringify(clients, null, 2));
  } catch (err) {
    console.error("QUERY ERROR:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
