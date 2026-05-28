const { Pool } = require('pg');
require('dotenv/config');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // Find sequences for RRHH schema tables
  const seqResult = await pool.query(`
    SELECT c.relname, t.relname as table_name
    FROM pg_class c
    JOIN pg_depend d ON c.oid = d.objid
    JOIN pg_class t ON d.refobjid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.relkind = 'S' AND n.nspname = 'RRHH'
  `);
  console.log('Sequences:', JSON.stringify(seqResult.rows, null, 2));
  
  // Get max IDs
  for (const table of ['RRHH_empleado', 'RRHH_solicitud', 'RRHH_rol', 'RRHH_usuario']) {
    const result = await pool.query(`SELECT MAX(id_${table.split('_')[1]}) as max_id FROM "RRHH"."${table}"`);
    const maxId = result.rows[0]?.max_id || 0;
    console.log(`${table}: max id = ${maxId}`);
    
    // Try pg_get_serial_sequence
    const seq = await pool.query(`SELECT pg_get_serial_sequence('"RRHH"."${table}"', 'id_${table.split('_')[1]}') as seq_name`);
    console.log(`${table}: sequence name = ${JSON.stringify(seq.rows[0])}`);
    
    if (seq.rows[0]?.seq_name) {
      await pool.query(`SELECT setval($1, $2)`, [seq.rows[0].seq_name, maxId]);
      console.log(`${table}: sequence reset to ${maxId}`);
    }
  }
  
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
