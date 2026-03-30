import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listLotes } from '@/repositories/produccionRepository.js';

const formatCurrency = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v || 0);

const RentabilidadPorLotePage = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => { listLotes().then(setRows); }, []);

  return (
    <>
      <Helmet><title>Rentabilidad por Lote | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Rentabilidad por lote</h1>
        <Card>
          <CardHeader><CardTitle>Márgenes por lote/orden</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left"><th className="py-2">Lote</th><th className="py-2">Orden</th><th className="py-2 text-right">Costo total</th><th className="py-2 text-right">Ingreso</th><th className="py-2 text-right">Margen</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="py-2">{r.lote_produccion}</td>
                    <td className="py-2">{r.expand?.orden_ref?.orden || '-'}</td>
                    <td className="py-2 text-right font-mono">{formatCurrency(r.costo_total_lote)}</td>
                    <td className="py-2 text-right font-mono">{formatCurrency(r.ingreso_total_lote)}</td>
                    <td className="py-2 text-right font-mono">{formatCurrency(r.margen_lote)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RentabilidadPorLotePage;
