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

/**
 * Recepción de materia prima — esquema validado contra `bd_patacon (2) (2).sql`:
 * - `registro_recepcion_materia_prima`: id, fecha, id_proveedor, producto, cantidad (kg), materia_recep, lote, orden, …
 * - `proveedores_materia_prima`: id, nombre, …
 * - `registro_recepcion_materia_prima_pesaje`: lote, variedad, estado, fecha (variedad complementaria por lote)
 *
 * Aliases de salida alineados con `integration.js` → JSON esperado por `LotsPage.jsx`.
 */
const fetchLotesRecepcionMateriaPrimaFromDb = async ({ from, to, limit = 100 } = {}) => {
  const where = [];
  const params = [];

  if (from) {
    where.push('DATE(r.`fecha`) >= ?');
    params.push(from);
  }
  if (to) {
    where.push('DATE(r.`fecha`) <= ?');
    params.push(to);
  }

  const parsedLimit = Number(limit);
  const safeLimit = Number.isFinite(parsedLimit) && parsedLimit > 0
    ? Math.min(Math.floor(parsedLimit), 5000)
    : 100;
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  return query(
    `SELECT
      r.\`id\` AS recepcion_id,
      r.\`fecha\` AS fecha_recepcion,
      r.\`lote\` AS lote_codigo,
      r.\`producto\` AS tipo_platano,
      r.\`cantidad\` AS kg_recibidos,
      r.\`materia_recep\` AS kg_materia_declarada,
      r.\`orden\` AS orden_produccion,
      COALESCE(p.\`nombre\`, CONCAT('Proveedor #', r.\`id_proveedor\`)) AS proveedor_nombre,
      (
        SELECT pes.\`variedad\`
        FROM \`registro_recepcion_materia_prima_pesaje\` pes
        WHERE pes.\`lote\` = r.\`lote\` AND pes.\`estado\` = 1
        ORDER BY pes.\`fecha\` DESC
        LIMIT 1
      ) AS variedad
    FROM \`registro_recepcion_materia_prima\` r
    LEFT JOIN \`proveedores_materia_prima\` p ON p.\`id\` = r.\`id_proveedor\`
    ${whereSql}
    ORDER BY r.\`fecha\` DESC, r.\`id\` DESC
    LIMIT ${safeLimit}`,
    params
  );
};

const fetchRecepcionMateriaPrimaById = async (recepcionId) => {
  const rows = await query(
    `SELECT
      r.\`id\` AS recepcion_id,
      r.\`fecha\` AS fecha_recepcion,
      r.\`lote\` AS lote_codigo,
      r.\`producto\` AS tipo_platano,
      r.\`cantidad\` AS kg_recibidos,
      r.\`materia_recep\` AS kg_materia_declarada,
      r.\`orden\` AS orden_produccion,
      COALESCE(p.\`nombre\`, CONCAT('Proveedor #', r.\`id_proveedor\`)) AS proveedor_nombre,
      (
        SELECT pes.\`variedad\`
        FROM \`registro_recepcion_materia_prima_pesaje\` pes
        WHERE pes.\`lote\` = r.\`lote\` AND pes.\`estado\` = 1
        ORDER BY pes.\`fecha\` DESC
        LIMIT 1
      ) AS variedad
    FROM \`registro_recepcion_materia_prima\` r
    LEFT JOIN \`proveedores_materia_prima\` p ON p.\`id\` = r.\`id_proveedor\`
    WHERE r.\`id\` = ?
    LIMIT 1`,
    [recepcionId]
  );
  return rows[0] || null;
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
      COALESCE(dfp_aggr.proveedores_nombres, '') AS proveedores_nombres
    FROM \`lotes_fritura\` lf
    LEFT JOIN \`registro_area_fritura\` rf ON rf.id = lf.id_fritura
    LEFT JOIN (
      SELECT
        dfp.id_fritura,
        dfp.lote_produccion,
        GROUP_CONCAT(DISTINCT p.nombre ORDER BY p.nombre SEPARATOR ', ') AS proveedores_nombres
      FROM \`detalle_fritura_proveedor\` dfp
      INNER JOIN \`proveedores_materia_prima\` p ON p.id = dfp.id_proveedor
      GROUP BY dfp.id_fritura, dfp.lote_produccion
    ) AS dfp_aggr
      ON dfp_aggr.id_fritura = lf.id_fritura
      AND dfp_aggr.lote_produccion = lf.lote_produccion
    ${whereSql}
    ORDER BY lf.fecha_produccion DESC, lf.id DESC`,
    params
  );
};

const fetchProduccionByDateFromDb = async (date) => {
  const performance = await query(
    `SELECT
      activity.orden AS orden,
      ? AS fecha,
      COALESCE(lf_daily.lote_produccion, rrmp_daily.lote_recepcion) AS lote_produccion,
      COALESCE(rf_daily.kg_fritura, 0) AS kg_fritura,
      COALESCE(rf_daily.rechazo_fritura, 0) AS rechazo_fritura,
      COALESCE(rf_daily.canastillas, 0) AS canastillas,
      COALESCE(rae_daily.total_cajas, 0) AS total_cajas,
      COALESCE(rf_daily.gas_consumo, 0) AS gas_consumo,
      COALESCE(rrmp_daily.kg_recibidos, 0) AS kg_recibidos
    FROM (
      SELECT orden
      FROM (
        SELECT rrmp.orden
        FROM \`registro_recepcion_materia_prima\` rrmp
        WHERE DATE(rrmp.fecha) = ? AND rrmp.orden IS NOT NULL
        UNION ALL
        SELECT rac.orden
        FROM \`registro_area_corte\` rac
        WHERE DATE(rac.fecha) = ? AND rac.orden IS NOT NULL
        UNION ALL
        SELECT rf.orden
        FROM \`registro_area_fritura\` rf
        WHERE DATE(rf.fecha) = ? AND rf.orden IS NOT NULL
        UNION ALL
        SELECT rae.orden
        FROM \`registro_area_empaque\` rae
        WHERE DATE(rae.fecha_empaque) = ? AND rae.orden IS NOT NULL
      ) AS unioned
      GROUP BY orden
    ) AS activity
    LEFT JOIN (
      SELECT
        rf.orden,
        SUM(COALESCE(rf.materia_fritura, 0)) AS kg_fritura,
        SUM(COALESCE(rf.rechazo_fritura, 0)) AS rechazo_fritura,
        SUM(COALESCE(rf.canastillas, 0)) AS canastillas,
        SUM(
          CASE
            WHEN rf.gas_final IS NOT NULL AND rf.gas_inicio IS NOT NULL
              THEN (rf.gas_final - rf.gas_inicio)
            ELSE 0
          END
        ) AS gas_consumo
      FROM \`registro_area_fritura\` rf
      WHERE DATE(rf.fecha) = ?
      GROUP BY rf.orden
    ) AS rf_daily ON rf_daily.orden = activity.orden
    LEFT JOIN (
      SELECT
        rae.orden,
        SUM(COALESCE(rae.total_cajas, 0)) AS total_cajas
      FROM \`registro_area_empaque\` rae
      WHERE DATE(rae.fecha_empaque) = ?
      GROUP BY rae.orden
    ) AS rae_daily ON rae_daily.orden = activity.orden
    LEFT JOIN (
      SELECT
        rrmp.orden,
        SUM(COALESCE(rrmp.cantidad, 0)) AS kg_recibidos,
        MAX(rrmp.lote) AS lote_recepcion
      FROM \`registro_recepcion_materia_prima\` rrmp
      WHERE DATE(rrmp.fecha) = ?
      GROUP BY rrmp.orden
    ) AS rrmp_daily ON rrmp_daily.orden = activity.orden
    LEFT JOIN (
      SELECT
        rf.orden,
        MAX(lf.lote_produccion) AS lote_produccion
      FROM \`registro_area_fritura\` rf
      INNER JOIN \`lotes_fritura\` lf ON lf.id_fritura = rf.id
      WHERE DATE(rf.fecha) = ?
      GROUP BY rf.orden
    ) AS lf_daily ON lf_daily.orden = activity.orden
    ORDER BY activity.orden ASC
    `,
    [date, date, date, date, date, date, date, date, date]
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

export {
  fetchProduccionByDate,
  fetchLotesFrituraFromApi,
  fetchLotesFrituraFromDb,
  fetchLotesRecepcionMateriaPrimaFromDb,
  fetchRecepcionMateriaPrimaById
};
