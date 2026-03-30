import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card } from '@/components/ui/card';
import { listLotes } from '@/repositories/produccionRepository.js';

const LotsPage = () => {
  const [lots, setLots] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listLotes()
      .then(setLots)
      .catch((e) => setError(e.message));
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

        <Card className="card-shadow overflow-hidden border-t-4 border-t-primary">
          <div className="overflow-x-auto">
            <table className="table-professional">
              <thead>
                <tr>
                  <th>Lote producción</th>
                  <th>Orden</th>
                  <th className="text-right">Kg salida</th>
                  <th className="text-right">Cajas</th>
                  <th className="text-right">Costo MP</th>
                  <th className="text-right">Costo total</th>
                  <th className="text-right">Margen</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id}>
                    <td className="font-medium text-slate-900">{lot.lote_produccion}</td>
                    <td className="text-slate-700">{lot.expand?.orden_ref?.orden || '-'}</td>
                    <td className="text-right font-mono text-slate-700 text-base">{Number(lot.kg_salida || 0).toLocaleString()}</td>
                    <td className="text-right font-mono text-slate-700 text-base">{Number(lot.cajas_salida || 0).toLocaleString()}</td>
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