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
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  });
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || `HTTP ${response.status}` };
  }
  if (!response.ok) {
    const msg =
      data.message ||
      (typeof data.error === 'string' ? data.error : null) ||
      text ||
      `HTTP ${response.status}`;
    throw new Error(msg);
  }
  return data;
};

const buildLotesQuery = ({ from, to, estado } = {}) => {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  if (estado) params.set('estado', estado);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

const normalizeLote = (row) => ({
  id: row.id || `rrmp:${row.recepcion_id || row.id_lote || 'na'}`,
  recepcion_id: row.recepcion_id ?? null,
  id_lote: row.id_lote || '',
  proveedor: row.proveedor || '',
  tipo_platano: row.tipo_platano || '',
  variedad: row.variedad || '',
  cantidad_kg: Number(row.cantidad_kg || 0),
  precio_kg: Number(row.precio_kg || 0),
  valor_total: Number(row.valor_total || 0),
  fecha: row.fecha || null,
  estado: row.estado || 'Pendiente'
});

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
      const lotes = Array.isArray(data.lotes) ? data.lotes.map(normalizeLote) : [];
      return {
        lotes,
        sourceWarning: data.sourceWarning || '',
        sourceUsed: data.sourceUsed || ''
      };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('No se pudo consultar la API de integración (recepción).');
};

const valorizarRecepcionLote = async (recepcionId, precioKg) => {
  if (!Number.isFinite(Number(precioKg)) || Number(precioKg) <= 0) {
    throw new Error('El precio por kg debe ser un numero mayor a 0.');
  }
  const body = JSON.stringify({ recepcionId, precioKg });
  const candidates = [
    '/hcgi/api/integration/agricol/lotes/valorizar',
    'http://localhost:3001/integration/agricol/lotes/valorizar'
  ];
  let lastError = null;
  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      return data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('No se pudo conectar al servidor de integración.');
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

export { listOrders, listLotes, listLotesConProduccion, listHechosByRange, valorizarRecepcionLote };
