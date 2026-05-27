const backendUrlInput = document.getElementById('backend-url');
const statusBox = document.getElementById('request-status');

const resultTargets = {
  '/direcciones': 'direcciones-result',
  '/transportistas': 'transportistas-result',
  '/pickings': 'pickings-result',
  '/guias': 'guias-result',
  '/kpis/productividad': 'kpis-result',
  '/kpis/tiempo-despacho': 'kpis-result',
};

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

function showResult(path, data) {
  const targetId = resultTargets[path];
  if (!targetId) return;
  document.getElementById(targetId).textContent = JSON.stringify(data, null, 2);
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

async function get(path) {
  try {
    const { data } = await api().get(path);
    return data;
  } catch (error) {
    return formatAxiosError(error);
  }
}

async function runGet(path, label) {
  setStatus(`Consultando ${label}...`);
  const data = await get(path);
  showResult(path, data);

  if (data?.error) {
    setStatus(`Error: ${label}`);
    return;
  }

  const count = Array.isArray(data) ? data.length : undefined;
  const suffix = count !== undefined ? ` (${count} registros)` : '';
  setStatus(`OK: ${label}${suffix}`);
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

document.querySelectorAll('[data-get]').forEach((button) => {
  button.addEventListener('click', () => {
    const path = button.getAttribute('data-get');
    runGet(path, button.textContent.trim());
  });
});

document.getElementById('fetch-all')?.addEventListener('click', async () => {
  const endpoints = [
    ['/direcciones', 'GET /direcciones'],
    ['/transportistas', 'GET /transportistas'],
    ['/pickings', 'GET /pickings'],
    ['/guias', 'GET /guias'],
    ['/kpis/productividad', 'GET /kpis/productividad'],
    ['/kpis/tiempo-despacho', 'GET /kpis/tiempo-despacho'],
  ];

  setStatus('Consultando todos los endpoints...');
  for (const [path, label] of endpoints) {
    await runGet(path, label);
  }
  setStatus('Consulta completa en todos los endpoints');
});
