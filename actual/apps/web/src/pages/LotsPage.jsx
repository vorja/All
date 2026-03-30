import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card } from '@/components/ui/card';
import { listLotesConProduccion } from '@/repositories/produccionRepository.js';

const LotsPage = () => {
  const [lots, setLots] = useState([]);
  const [error, setError] = useState('');
  const [sourceWarning, setSourceWarning] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    estado: 'todos',
    source: 'auto'
  });

  const loadLots = () => {
    setLoading(true);
    setError('');
    listLotesConProduccion(filters)
      .then((result) => {
        setLots(result.lotes || []);
        setSourceWarning(result.sourceWarning || '');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLots();
  }, []);

  const formatCurrency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0);

  return (
    <>
      <Helmet><title>Recepción de Lotes | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recepción de Lotes</h1>
          <p className="text-slate-500 mt-1">Gestión y valorización de lotes recibidos.</p>
        </div>
        {error ? <div className="text-red-600 text-sm">{error}</div> : null}
        {sourceWarning ? <div className="text-amber-700 text-sm">{sourceWarning}</div> : null}
        <Card className="p-4 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <label className="text-sm text-slate-700">
              Desde
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-700">
              Hasta
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </label>
            <label className="text-sm text-slate-700">
              Estado valorización
              <select
                value={filters.estado}
                onChange={(e) => setFilters((prev) => ({ ...prev, estado: e.target.value }))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              >
                <option value="todos">Todos</option>
                <option value="pendiente">Pendientes</option>
                <option value="valorizado">Valorizados</option>
              </select>
            </label>
            <label className="text-sm text-slate-700">
              Fuente
              <select
                value={filters.source}
                onChange={(e) => setFilters((prev) => ({ ...prev, source: e.target.value }))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              >
                <option value="auto">Auto (API + DB fallback)</option>
                <option value="api">Solo API</option>
                <option value="db">Solo DB</option>
              </select>
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={loadLots} className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm">
                Aplicar
              </button>
              <button
                type="button"
                onClick={() => setFilters({ from: '', to: '', estado: 'todos', source: 'auto' })}
                className="px-3 py-2 rounded-md border text-sm"
              >
                Limpiar
              </button>
            </div>
          </div>
        </Card>
        {!error && lots.length === 0 ? (
          <div className="text-slate-600 text-sm bg-slate-50 border border-slate-200 rounded-md p-3">
            {loading
              ? 'Cargando lotes...'
              : 'Aun no hay lotes visibles para los filtros seleccionados. Verifica API/DB de `agricol_patacon` o ajusta filtros.'}
          </div>
        ) : null}

        <Card className="card-shadow overflow-hidden border-t-4 border-t-primary">
          <div className="overflow-x-auto">
            <table className="table-professional">
              <thead>
                <tr>
                  <th>Lote producción</th>
                  <th>Fecha</th>
                  <th>Orden</th>
                  <th className="text-right">Kg salida</th>
                  <th className="text-right">Cajas</th>
                  <th className="text-center">Estado valorizacion</th>
                  <th className="text-right">Costo MP</th>
                  <th className="text-right">Costo total</th>
                  <th className="text-right">Margen</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id}>
                    <td className="font-medium text-slate-900">{lot.lote_produccion}</td>
                    <td className="text-slate-700">{lot.fecha_produccion || '-'}</td>
                    <td className="text-slate-700">{lot.orden || lot.expand?.orden_ref?.orden || '-'}</td>
                    <td className="text-right font-mono text-slate-700 text-base">{Number(lot.kg_salida || 0).toLocaleString()}</td>
                    <td className="text-right font-mono text-slate-700 text-base">{Number(lot.cajas_salida || 0).toLocaleString()}</td>
                    <td className={`text-center text-xs font-semibold ${lot.estado_valorizacion === 'Pendiente' ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {lot.estado_valorizacion || 'Pendiente'}
                    </td>
                    <td className="text-right font-mono">{formatCurrency(lot.costo_materia_prima_total)}</td>
                    <td className="text-right font-mono">{formatCurrency(lot.costo_total_lote)}</td>
                    <td className="text-right font-mono">{formatCurrency(lot.margen_lote)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};

export default LotsPage;