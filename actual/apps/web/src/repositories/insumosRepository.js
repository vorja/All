import pb from '@/lib/pocketbaseClient.js';

const listInsumos = async () => {
  return pb.collection('insumos').getFullList({ sort: 'nombre' });
};

const updateInsumo = async (id, payload) => {
  return pb.collection('insumos').update(id, payload);
};

const listIngresosInsumos = async () => {
  return pb.collection('ingresos_insumos').getFullList({
    sort: '-fecha',
    expand: 'insumo_id'
  });
};

const createIngresoInsumo = async (payload) => {
  return pb.collection('ingresos_insumos').create(payload);
};

export { listInsumos, updateInsumo, listIngresosInsumos, createIngresoInsumo };
