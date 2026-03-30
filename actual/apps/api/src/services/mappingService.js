const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const getDateOnly = (value) => {
  if (!value) return null;
  return String(value).slice(0, 10);
};

const mapToIntegrationEvents = ({ performance, frituraLotes }, sourceDate) => {
  const events = [];

  const perfRows = Array.isArray(performance) ? performance : [performance];
  perfRows.filter(Boolean).forEach((row, idx) => {
    const orden = row.orden || row.contenedor || row.id_contenedor || null;
    if (!orden) return;

    events.push({
      sourceSystem: "agricol_patacon",
      sourceId: `perf-${sourceDate}-${idx}`,
      sourceVersion: "v1",
      fecha: getDateOnly(row.fecha || sourceDate),
      orden,
      loteProduccion: row.lote_produccion || row.lote || null,
      faseCodigo: "fritura",
      kgProcesados: toNumber(row.materia_fritura || row.kg_fritura || row.total_materia),
      kgRechazo: toNumber(row.rechazo_fritura || row.rechazo || 0),
      canastillas: toNumber(row.canastillas || 0),
      cajas: toNumber(row.total_cajas || row.cajas || 0),
      gasM3: toNumber(row.gas_consumo || 0),
      energiaKwh: toNumber(row.energia_consumo || 0),
      aguaM3: toNumber(row.agua_consumo || 0),
      raw: row
    });
  });

  const lotesRows = Array.isArray(frituraLotes) ? frituraLotes : [frituraLotes];
  lotesRows.filter(Boolean).forEach((row, idx) => {
    if (!row.lote_produccion && !row.lote) return;
    const orden = row.orden || row.lote_produccion || row.lote || `lote-${sourceDate}-${idx}`;
    events.push({
      sourceSystem: "agricol_patacon",
      sourceId: `lote-${sourceDate}-${idx}`,
      sourceVersion: "v1",
      fecha: getDateOnly(row.fecha_produccion || row.fecha || sourceDate),
      orden,
      loteProduccion: row.lote_produccion || row.lote,
      faseCodigo: "empaque",
      kgProcesados: toNumber(row.cantidad_kg || 0),
      kgRechazo: 0,
      canastillas: toNumber(row.canastas || 0),
      cajas: toNumber(row.total_cajas || 0),
      gasM3: 0,
      energiaKwh: 0,
      aguaM3: 0,
      raw: row
    });
  });

  return events.filter((event) => event.fecha && event.orden);
};

export { mapToIntegrationEvents };
