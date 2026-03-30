import { query } from '../utils/agricolDbClient.js';
import jwt from 'jsonwebtoken';

const AGRICOL_SOURCE_MODE = process.env.AGRICOL_SOURCE_MODE || 'db';
const AGRICOL_API_URL = process.env.AGRICOL_API_URL || 'http://localhost:3000';
const AGRICOL_API_TOKEN = process.env.AGRICOL_API_TOKEN || '';
const AGRICOL_API_JWT_SECRET = process.env.AGRICOL_API_JWT_SECRET || '';
const AGRICOL_API_ROLE = process.env.AGRICOL_API_ROLE || 'Dashboard';
const AGRICOL_API_USER_ID = Number(process.env.AGRICOL_API_USER_ID || 1);

const buildHeaders = () => {
  const headers = {
    "Content-Type": "application/json"
  };
  if (AGRICOL_API_TOKEN) {
    headers.Authorization = `Bearer ${AGRICOL_API_TOKEN}`;
    return headers;
  }
  if (AGRICOL_API_JWT_SECRET) {
    const token = jwt.sign(
      { id: AGRICOL_API_USER_ID, rol: AGRICOL_API_ROLE },
      AGRICOL_API_JWT_SECRET,
      { expiresIn: '8h' }
    );
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const getJson = async (path) => {
  try {
    const response = await fetch(`${AGRICOL_API_URL}${path}`, {
      method: "GET",
      headers: buildHeaders()
    });
    if (!response.ok) {
      const body = await response.text();
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed request ${path}: ${response.status} ${body}`);
    }
    return response.json();
  } catch (error) {
    // Keep integration resilient when production API is down.
    if (error?.message?.includes('fetch failed')) {
      return [];
    }
    throw error;
  }
};

const fetchProduccionByDateFromApi = async (date) => {
  const [performanceRaw, frituraLotesRaw] = await Promise.all([
    getJson(`/data/produccion/performance/${date}`),
    getJson('/data/lotes-fritura/obtener')
  ]);
  return {
    performance: normalizePerformancePayload(performanceRaw),
    frituraLotes: normalizeLotesPayload(frituraLotesRaw)
  };
};

const normalizeLotesPayload = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  if (raw && Array.isArray(raw.payload)) return raw.payload;
  return [];
};

const normalizePerformancePayload = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  if (raw && raw.data != null && !Array.isArray(raw.data)) return [raw.data];
  if (raw && Array.isArray(raw.payload)) return raw.payload;
  return [];
};

const fetchLotesFrituraFromApi = async () => {
  const raw = await getJson('/data/lotes-fritura/obtener');
  return normalizeLotesPayload(raw);
};

const fetchLotesFrituraFromDb = async ({ from, to } = {}) => {
  const where = [];
  const params = [];

  if (from) {
    where.push('DATE(lf.fecha_produccion) >= ?');
    params.push(from);
  }
  if (to) {
    where.push('DATE(lf.fecha_produccion) <= ?');
    params.push(to);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return query(
    `SELECT
      lf.id,
      lf.fecha_produccion,
      lf.lote_produccion,
      lf.tipo,
      lf.canastas,
      lf.cantidad_kg,
      lf.estado,
      rf.orden,
      rf.producto AS producto_fritura,
      (
        SELECT GROUP_CONCAT(DISTINCT p.nombre ORDER BY p.nombre SEPARATOR ', ')
        FROM detalle_fritura_proveedor dfp
        INNER JOIN proveedores_materia_prima p ON p.id = dfp.id_proveedor
        WHERE dfp.id_fritura = lf.id_fritura
          AND dfp.lote_produccion = lf.lote_produccion
      ) AS proveedores_nombres
    FROM lotes_fritura lf
    LEFT JOIN registro_area_fritura rf ON rf.id = lf.id_fritura
    ${whereSql}
    ORDER BY lf.fecha_produccion DESC, lf.id DESC`,
    params
  );
};

const fetchProduccionByDateFromDb = async (date) => {
  const performance = await query(
    `SELECT
      COALESCE(rf.orden, rae.orden, rac.orden, rrmp.orden) AS orden,
      COALESCE(rf.fecha, rae.fecha_empaque, rac.fecha, rrmp.fecha) AS fecha,
      rf.lote_produccion AS lote_produccion,
      rf.materia_fritura AS kg_fritura,
      rf.rechazo_fritura AS rechazo_fritura,
      rf.canastillas AS canastillas,
      rae.total_cajas AS total_cajas,
      (rf.gas_final - rf.gas_inicio) AS gas_consumo
    FROM registro_area_fritura rf
    LEFT JOIN registro_area_empaque rae ON rae.orden = rf.orden
    LEFT JOIN registro_area_corte rac ON rac.orden = rf.orden
    LEFT JOIN registro_recepcion_materia_prima rrmp ON rrmp.orden = rf.orden
    WHERE DATE(COALESCE(rf.fecha, rae.fecha_empaque, rac.fecha, rrmp.fecha)) = ?
    `,
    [date]
  );

  const frituraLotes = await query(
    `SELECT
      fecha_produccion,
      lote_produccion,
      tipo,
      canastas,
      cantidad_kg,
      orden
    FROM lotes_fritura
    WHERE DATE(fecha_produccion) = ?`,
    [date]
  );

  return { performance, frituraLotes };
};

const fetchProduccionByDate = async (date) => {
  if (AGRICOL_SOURCE_MODE === 'api') {
    return fetchProduccionByDateFromApi(date);
  }
  return fetchProduccionByDateFromDb(date);
};

export { fetchProduccionByDate, fetchLotesFrituraFromApi, fetchLotesFrituraFromDb };
