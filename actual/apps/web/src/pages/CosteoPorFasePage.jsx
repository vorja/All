import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listCostosByRange } from '@/repositories/costosRepository.js';
import { listHechosByRange } from '@/repositories/produccionRepository.js';

const today = new Date().toISOString().slice(0, 10);
const firstDay = `${today.slice(0, 8)}01`;
const formatCurrency = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v || 0);

const CosteoPorFasePage = () => {
  const [costos, setCostos] = useState([]);
  const [hechos, setHechos] = useState([]);

  useEffect(() => {
    Promise.all([listCostosByRange(firstDay, today), listHechosByRange(firstDay, today)]).then(([c, h]) => {
      setCostos(c);
      setHechos(h);
    });
  }, []);

  const rows = useMemo(() => {
    const out = {};
    costos.forEach((c) => {
      const fase = c.expand?.fase_ref?.codigo || 'sin_fase';
      if (!out[fase]) out[fase] = { costo: 0, kg: 0, cajas: 0 };
      out[fase].costo += Number(c.costo_total_fase || 0);
    });
    hechos.forEach((h) => {
      const fase = h.expand?.fase_ref?.codigo || 'sin_fase';
      if (!out[fase]) out[fase] = { costo: 0, kg: 0, cajas: 0 };
      out[fase].kg += Number(h.kg_procesados || 0);
      out[fase].cajas += Number(h.cajas || 0);
    });
    return Object.entries(out).map(([fase, data]) => ({
      fase,
      ...data,
      costoKg: data.kg > 0 ? data.costo / data.kg : 0,
      costoCaja: data.cajas > 0 ? data.costo / data.cajas : 0
    }));
  }, [costos, hechos]);

  return (
    <>
      <Helmet><title>Costeo por Fase | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Costeo por fase</h1>
        <Card>
          <CardHeader><CardTitle>Costo unitario por fase (mes actual)</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left"><th className="py-2">Fase</th><th className="py-2 text-right">Costo total</th><th className="py-2 text-right">Kg</th><th className="py-2 text-right">Cajas</th><th className="py-2 text-right">Costo/kg</th><th className="py-2 text-right">Costo/caja</th></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.fase} className="border-b">
                    <td className="py-2">{row.fase}</td>
                    <td className="py-2 text-right font-mono">{formatCurrency(row.costo)}</td>
                    <td className="py-2 text-right font-mono">{row.kg.toLocaleString()}</td>
                    <td className="py-2 text-right font-mono">{row.cajas.toLocaleString()}</td>
                    <td className="py-2 text-right font-mono">{formatCurrency(row.costoKg)}</td>
                    <td className="py-2 text-right font-mono">{formatCurrency(row.costoCaja)}</td>
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

export default CosteoPorFasePage;
