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

function api() {
  return axios.create({
    baseURL: getBase(),
    headers: { 'Content-Type': 'application/json' },
  });
}

function setStatus(message) {
  statusBox.textContent = message;
}

function formatAxiosError(error) {
  if (error.response) {
    return {
      error: error.response.data ?? error.message,
      status: error.response.status,
    };
  }
  if (error.request) {
    return { error: `No se pudo conectar con el backend: ${error.message}` };
  }
  return { error: error.message };
}

async function post(path, body) {
  try {
    const { data } = await api().post(path, body);
    return data;
  } catch (error) {
    return formatAxiosError(error);
  }
}

async function get(path) {
  try {
    const { data } = await api().get(path);
    return data;
  } catch (error) {
    return formatAxiosError(error);
  }
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

document.getElementById('direccion-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const body = { direccion: f.direccion.value, id_cliente: Number(f.id_cliente.value) };
  setStatus('Enviando dirección...');
  const r = await post('/direcciones', body);
  document.getElementById('direccion-result').textContent = JSON.stringify(r, null, 2);
  setStatus(r?.error ? 'Error al enviar dirección' : 'Dirección enviada correctamente');
});

document.getElementById('transportista-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const body = {
    nombre_transp: f.nombre_transp.value,
    patente_vehiculo: f.patente_vehiculo.value,
    id_empleado: Number(f.id_empleado.value),
  };
  setStatus('Enviando transportista...');
  const r = await post('/transportistas', body);
  document.getElementById('transportista-result').textContent = JSON.stringify(r, null, 2);
  setStatus(r?.error ? 'Error al enviar transportista' : 'Transportista enviado correctamente');
});

document.getElementById('picking-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const body = { id_pedido_venta: Number(f.id_pedido_venta.value), estado: f.estado.value };
  setStatus('Enviando picking...');
  const r = await post('/pickings', body);
  document.getElementById('picking-result').textContent = JSON.stringify(r, null, 2);
  setStatus(r?.error ? 'Error al enviar picking' : 'Picking enviado correctamente');
});

document.getElementById('guia-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target;
  const body = {
    id_ot: Number(f.id_ot.value),
    id_transportista: Number(f.id_transportista.value),
    id_direccion: Number(f.id_direccion.value),
  };
  setStatus('Enviando guía...');
  const r = await post('/guias', body);
  document.getElementById('guia-result').textContent = JSON.stringify(r, null, 2);
  setStatus(r?.error ? 'Error al enviar guía' : 'Guía enviada correctamente');
});

document.getElementById('kpi-productividad').addEventListener('click', async () => {
  setStatus('Consultando KPI productividad...');
  const r = await get('/kpis/productividad');
  document.getElementById('kpi-result').textContent = JSON.stringify(r, null, 2);
  setStatus(r?.error ? 'Error al consultar KPI productividad' : 'KPI productividad obtenido');
});

document.getElementById('kpi-tiempo').addEventListener('click', async () => {
  setStatus('Consultando KPI tiempo despacho...');
  const r = await get('/kpis/tiempo-despacho');
  document.getElementById('kpi-result').textContent = JSON.stringify(r, null, 2);
  setStatus(r?.error ? 'Error al consultar KPI tiempo despacho' : 'KPI tiempo despacho obtenido');
});
