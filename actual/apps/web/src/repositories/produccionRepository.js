import pb from '@/lib/pocketbaseClient.js';

const listOrders = async () => {
  return pb.collection('ordenes_produccion_ext').getFullList({
    sort: '-updated'
  });
};

const listLotes = async () => {
  return pb.collection('lotes_produccion_ext').getFullList({
    sort: '-fecha_produccion'
  });
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
};

const buildLotesQuery = ({ from, to, estado, source } = {}) => {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  if (estado) params.set('estado', estado);
  if (source) params.set('source', source);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

const listLotesConProduccion = async (filters = {}) => {
  const query = buildLotesQuery(filters);
  const candidates = [
    `/hcgi/api/integration/agricol/lotes${query}`,
    `http://localhost:3001/integration/agricol/lotes${query}`
  ];
  let lastError = null;
  for (const url of candidates) {
    try {
      const data = await fetchJson(url);
      return {
        lotes: data.lotes || [],
        sourceWarning: data.sourceWarning || ''
      };
    } catch (error) {
      lastError = error;
    }
  }
  const fallback = await listLotes().catch(() => []);
  return {
    lotes: fallback,
    sourceWarning: `No fue posible consultar API de produccion. Mostrando lotes de PocketBase. ${lastError ? `Detalle: ${lastError.message}` : ''}`.trim()
  };
};

const listHechosByRange = async (from, to) => {
  const filters = [];
  if (from) filters.push(`fecha >= '${from}'`);
  if (to) filters.push(`fecha <= '${to}'`);
  const filter = filters.join(' && ');
  return pb.collection('hechos_fase_diarios').getFullList({
    sort: '-fecha',
    filter,
    expand: 'fase_ref,orden_ref,lote_ref'
  });
};

export { listOrders, listLotes, listLotesConProduccion, listHechosByRange };
