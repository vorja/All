import { Router } from 'express';
import { runSync } from '../services/integrationService.js';
import { fetchLotesFrituraFromApi, fetchProduccionByDate } from '../services/agricolFetchService.js';
import { mapToIntegrationEvents } from '../services/mappingService.js';
import pocketbaseClient from '../utils/pocketbaseClient.js';

const router = Router();

router.get('/agricol/status', async (_req, res, next) => {
  try {
    res.json({
      status: 'ready',
      integration: 'agricol_patacon_produccion'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/agricol/sync', async (req, res, next) => {
  try {
    const date = req.body?.date;
    const result = await runSync(date);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/agricol/preview', async (req, res, next) => {
  try {
    const date = req.query?.date || new Date().toISOString().slice(0, 10);
    let events = [];
    let sourceWarning = '';
    try {
      const sourceData = await fetchProduccionByDate(date);
      events = mapToIntegrationEvents(sourceData, date);
    } catch (error) {
      sourceWarning = `No fue posible leer preview desde API de produccion: ${error.message}`;
    }
    res.json({
      date,
      eventsCount: events.length,
      events,
      sourceWarning
    });
  } catch (error) {
    next(error);
  }
});

router.get('/agricol/lotes', async (_req, res, next) => {
  try {
    let lotesProduccion = await fetchLotesFrituraFromApi().catch(() => []);
    let sourceWarning = '';
    if (!Array.isArray(lotesProduccion)) {
      lotesProduccion = [];
    }
    if (lotesProduccion.length === 0) {
      sourceWarning = 'No fue posible leer lotes desde API de produccion (o no hay datos en este momento).';
    }

    const lotesCostos = await pocketbaseClient.collection('lotes_produccion_ext').getFullList({
      sort: '-fecha_produccion'
    }).catch(() => []);

    const costosMap = new Map(
      lotesCostos.map((row) => [
        row.lote_produccion,
        {
          costoMateriaPrima: Number(row.costo_materia_prima_total || 0),
          costoTotal: Number(row.costo_total_lote || 0),
          margen: Number(row.margen_lote || 0)
        }
      ])
    );

    const merged = lotesProduccion.map((row, idx) => {
      const loteProduccion = row.lote_produccion || row.lote || `lote-${idx}`;
      const costo = costosMap.get(loteProduccion);
      return {
        id: `${loteProduccion}-${idx}`,
        lote_produccion: loteProduccion,
        orden: row.orden || '-',
        fecha_produccion: row.fecha_produccion || null,
        kg_salida: Number(row.cantidad_kg || 0),
        cajas_salida: Number(row.total_cajas || 0),
        canastas: Number(row.canastas || 0),
        estado_valorizacion: costo && costo.costoMateriaPrima > 0 ? 'Valorizado' : 'Pendiente',
        costo_materia_prima_total: costo?.costoMateriaPrima || 0,
        costo_total_lote: costo?.costoTotal || 0,
        margen_lote: costo?.margen || 0
      };
    });

    res.json({
      total: merged.length,
      pendientes: merged.filter((l) => l.estado_valorizacion === 'Pendiente').length,
      lotes: merged,
      sourceWarning
    });
  } catch (error) {
    // Absolute fallback: never fail this route in UI.
    res.json({
      total: 0,
      pendientes: 0,
      lotes: [],
      sourceWarning: `Fallback activado en lotes: ${error.message}`
    });
  }
});

export default router;
