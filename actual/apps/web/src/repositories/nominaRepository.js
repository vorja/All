import pb from '@/lib/pocketbaseClient.js';

const listNomina = async (filter = '') => {
  return pb.collection('nomina').getFullList({
    sort: '-fecha',
    filter
  });
};

const createNomina = async (payload) => {
  return pb.collection('nomina').create(payload);
};

const importNominaRecords = async (records) => {
  const created = [];
  for (const record of records) {
    created.push(await createNomina(record));
  }
  return created;
};

export { listNomina, createNomina, importNominaRecords };
