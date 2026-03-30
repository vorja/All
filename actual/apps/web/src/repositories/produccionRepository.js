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

export { listOrders, listLotes, listHechosByRange };
