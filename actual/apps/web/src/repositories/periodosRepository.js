import pb from '@/lib/pocketbaseClient.js';

const getPeriodoEstado = async (anio, mes, quincena) => {
  try {
    return await pb
      .collection('periodos_contables')
      .getFirstListItem(`anio=${anio} && mes=${mes} && quincena=${quincena}`);
  } catch (_) {
    return null;
  }
};

export { getPeriodoEstado };
