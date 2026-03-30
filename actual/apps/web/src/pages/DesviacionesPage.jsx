import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listCostosByRange } from '@/repositories/costosRepository.js';
import { listHechosByRange } from '@/repositories/produccionRepository.js';

const today = new Date().toISOString().slice(0, 10);
const firstDay = `${today.slice(0, 8)}01`;
const COSTO_STD_KG = 2500;
const RECHAZO_STD = 0.03;

const DesviacionesPage = () => {
  const [costos, setCostos] = useState([]);
  const [hechos, setHechos] = useState([]);

  useEffect(() => {
    Promise.all([listCostosByRange(firstDay, today), listHechosByRange(firstDay, today)]).then(([c, h]) => {
      setCostos(c);
      setHechos(h);
    });
  }, []);

  const rows = useMemo(() => {
    const grouped = {};
    hechos.forEach((h) => {
      const phase = h.expand?.fase_ref?.codigo || 'sin_fase';
      if (!grouped[phase]) grouped[phase] = { kg: 0, rechazo: 0, costo: 0 };
      grouped[phase].kg += Number(h.kg_procesados || 0);
      grouped[phase].rechazo += Number(h.kg_rechazo || 0);
    });
    costos.forEach((c) => {
      const phase = c.expand?.fase_ref?.codigo || 'sin_fase';
      if (!grouped[phase]) grouped[phase] = { kg: 0, rechazo: 0, costo: 0 };
      grouped[phase].costo += Number(c.costo_total_fase || 0);
    });

    return Object.entries(grouped).map(([fase, data]) => {
      const costoKg = data.kg > 0 ? data.costo / data.kg : 0;
      const rechazoPct = data.kg > 0 ? data.rechazo / data.kg : 0;
      return {
        fase,
        costoKg,
        rechazoPct,
        deltaCostoPct: COSTO_STD_KG > 0 ? ((costoKg - COSTO_STD_KG) / COSTO_STD_KG) * 100 : 0,
        deltaRechazoPct: RECHAZO_STD > 0 ? ((rechazoPct - RECHAZO_STD) / RECHAZO_STD) * 100 : 0
      };
    });
  }, [costos, hechos]);

  return (
    <>
      <Helmet><title>Desviaciones | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Desviaciones real vs estándar</h1>
        <Card>
          <CardHeader><CardTitle>Variaciones por fase</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left"><th className="py-2">Fase</th><th className="py-2 text-right">Costo/Kg</th><th className="py-2 text-right">Delta costo %</th><th className="py-2 text-right">Rechazo %</th><th className="py-2 text-right">Delta rechazo %</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.fase} className="border-b">
                    <td className="py-2">{r.fase}</td>
                    <td className="py-2 text-right font-mono">{r.costoKg.toFixed(2)}</td>
                    <td className={`py-2 text-right font-mono ${r.deltaCostoPct > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{r.deltaCostoPct.toFixed(2)}%</td>
                    <td className="py-2 text-right font-mono">{(r.rechazoPct * 100).toFixed(2)}%</td>
                    <td className={`py-2 text-right font-mono ${r.deltaRechazoPct > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{r.deltaRechazoPct.toFixed(2)}%</td>
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

export default DesviacionesPage;
