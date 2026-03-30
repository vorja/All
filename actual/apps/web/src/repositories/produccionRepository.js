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

const listLotesConProduccion = async () => {
  const candidates = [
    '/hcgi/api/integration/agricol/lotes',
    'http://localhost:3001/integration/agricol/lotes'
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
