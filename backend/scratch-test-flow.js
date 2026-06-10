const axios = require('axios');

async function main() {
  try {
    const baseURL = 'http://localhost:3000/logistica';
    
    // 1. Create a picking for Pedido #22
    console.log("1. Creating picking for Pedido #22...");
    const pickingRes = await axios.post(`${baseURL}/pickings`, {
      id_pedido_venta: 22,
      estado: 'Pendiente'
    });
    const otId = pickingRes.data.id_ot;
    console.log(`Picking created! OT ID: ${otId}`);

    // 2. Assign operator #4 (Ana Martinez)
    console.log(`2. Assigning operator #4 to OT #${otId}...`);
    await axios.patch(`${baseURL}/pickings/${otId}/assign`, { id_empleado: 4 });
    console.log("Operator assigned.");

    // 3. Emit Guide with transportist #1 and delivery address #1
    console.log(`3. Emitting guide for OT #${otId}...`);
    const guiaRes = await axios.post(`${baseURL}/guias`, {
      id_ot: otId,
      id_transportista: 1,
      id_direccion: 1
    });
    console.log(`Guide emitted! Guide ID: ${guiaRes.data.id_guia}`);

    // 4. Confirm Dispatch
    console.log(`4. Confirming dispatch for OT #${otId}...`);
    const confirmRes = await axios.post(`${baseURL}/pickings/${otId}/confirm-dispatch`);
    console.log("DISPATCH CONFIRMED SUCCESS:", confirmRes.data);
  } catch (err) {
    console.log("ERROR STATUS:", err.response?.status);
    console.log("ERROR DATA:", err.response?.data);
  }
}

main();
