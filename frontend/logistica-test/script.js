const backendUrlInput = document.getElementById('backend-url');
const statusBox = document.createElement('pre');
statusBox.id = 'request-status';
statusBox.className = 'result';
statusBox.style.marginTop = '12px';
document.querySelector('.container').prepend(statusBox);

function getBase() {
  const url = backendUrlInput?.value?.trim() || 'http://localhost:3000';
  return url.replace(/\/$/, '') + '/logistica';
}

function setStatus(message) {
  statusBox.textContent = message;
}

async function post(path, body){
  const res = await fetch(getBase() + path, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  }).catch((error) => {
    throw new Error(`No se pudo conectar con el backend: ${error.message}`);
  });
  return res.ok ? res.json().catch(()=>null) : { error: await res.text() };
}

async function get(path){
  const res = await fetch(getBase() + path).catch((error) => {
    throw new Error(`No se pudo conectar con el backend: ${error.message}`);
  });
  return res.ok ? res.json() : { error: await res.text() };
}

backendUrlInput?.addEventListener('change', () => {
  localStorage.setItem('logistica-backend-url', backendUrlInput.value.trim());
  setStatus(`Backend configurado en ${backendUrlInput.value.trim() || 'http://localhost:3000'}`);
});

const savedBackendUrl = localStorage.getItem('logistica-backend-url');
if (savedBackendUrl) {
  backendUrlInput.value = savedBackendUrl;
}
setStatus(`Backend activo: ${getBase()}`);

// Direccion
document.getElementById('direccion-form').addEventListener('submit', async e=>{
  e.preventDefault();
  const f = e.target;
  const body = { direccion: f.direccion.value, id_cliente: Number(f.id_cliente.value) };
  try {
    setStatus('Enviando dirección...');
    const r = await post('/direcciones', body);
    document.getElementById('direccion-result').textContent = JSON.stringify(r, null, 2);
    setStatus('Dirección enviada correctamente');
  } catch (error) {
    document.getElementById('direccion-result').textContent = String(error.message || error);
    setStatus('Error al enviar dirección');
  }
});

// Transportista
document.getElementById('transportista-form').addEventListener('submit', async e=>{
  e.preventDefault();
  const f = e.target;
  const body = { nombre_transp: f.nombre_transp.value, patente_vehiculo: f.patente_vehiculo.value, id_empleado: Number(f.id_empleado.value) };
  try {
    setStatus('Enviando transportista...');
    const r = await post('/transportistas', body);
    document.getElementById('transportista-result').textContent = JSON.stringify(r, null, 2);
    setStatus('Transportista enviado correctamente');
  } catch (error) {
    document.getElementById('transportista-result').textContent = String(error.message || error);
    setStatus('Error al enviar transportista');
  }
});

// Picking
document.getElementById('picking-form').addEventListener('submit', async e=>{
  e.preventDefault();
  const f = e.target;
  const body = { id_pedido_venta: Number(f.id_pedido_venta.value), estado: f.estado.value };
  try {
    setStatus('Enviando picking...');
    const r = await post('/pickings', body);
    document.getElementById('picking-result').textContent = JSON.stringify(r, null, 2);
    setStatus('Picking enviado correctamente');
  } catch (error) {
    document.getElementById('picking-result').textContent = String(error.message || error);
    setStatus('Error al enviar picking');
  }
});

// Guia
document.getElementById('guia-form').addEventListener('submit', async e=>{
  e.preventDefault();
  const f = e.target;
  const body = { id_ot: Number(f.id_ot.value), id_transportista: Number(f.id_transportista.value), id_direccion: Number(f.id_direccion.value) };
  try {
    setStatus('Enviando guía...');
    const r = await post('/guias', body);
    document.getElementById('guia-result').textContent = JSON.stringify(r, null, 2);
    setStatus('Guía enviada correctamente');
  } catch (error) {
    document.getElementById('guia-result').textContent = String(error.message || error);
    setStatus('Error al enviar guía');
  }
});

// KPIs
document.getElementById('kpi-productividad').addEventListener('click', async ()=>{
  try {
    setStatus('Consultando KPI productividad...');
    const r = await get('/kpis/productividad');
    document.getElementById('kpi-result').textContent = JSON.stringify(r, null, 2);
    setStatus('KPI productividad obtenido');
  } catch (error) {
    document.getElementById('kpi-result').textContent = String(error.message || error);
    setStatus('Error al consultar KPI productividad');
  }
});

document.getElementById('kpi-tiempo').addEventListener('click', async ()=>{
  try {
    setStatus('Consultando KPI tiempo despacho...');
    const r = await get('/kpis/tiempo-despacho');
    document.getElementById('kpi-result').textContent = JSON.stringify(r, null, 2);
    setStatus('KPI tiempo despacho obtenido');
  } catch (error) {
    document.getElementById('kpi-result').textContent = String(error.message || error);
    setStatus('Error al consultar KPI tiempo despacho');
  }
});
