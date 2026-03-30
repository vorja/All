import pb from '@/lib/pocketbaseClient.js';

const listCostosByRange = async (from, to) => {
  const filters = [];
  if (from) filters.push(`fecha >= '${from}'`);
  if (to) filters.push(`fecha <= '${to}'`);
  const filter = filters.join(' && ');
  return pb.collection('costos_fase_diarios').getFullList({
    sort: '-fecha',
    filter,
    expand: 'fase_ref,orden_ref,lote_ref'
  });
};

const upsertCostoFase = async (payload) => {
  const keyFilter = `fecha='${payload.fecha}' && fase_ref='${payload.fase_ref}' && orden_ref='${payload.orden_ref}'`;
  try {
    const existing = await pb.collection('costos_fase_diarios').getFirstListItem(keyFilter);
    return pb.collection('costos_fase_diarios').update(existing.id, payload);
  } catch (_) {
    return pb.collection('costos_fase_diarios').create(payload);
  }
};

export { listCostosByRange, upsertCostoFase };
