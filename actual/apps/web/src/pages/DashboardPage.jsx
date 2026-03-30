import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listCostosByRange } from '@/repositories/costosRepository.js';
import { listHechosByRange } from '@/repositories/produccionRepository.js';
import { listNomina } from '@/repositories/nominaRepository.js';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0);

const today = new Date().toISOString().slice(0, 10);
const firstDay = `${today.slice(0, 8)}01`;

const DashboardPage = () => {
  const [costos, setCostos] = useState([]);
  const [hechos, setHechos] = useState([]);
  const [nomina, setNomina] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [costosRows, hechosRows, nominaRows] = await Promise.all([
          listCostosByRange(firstDay, today),
          listHechosByRange(firstDay, today),
          listNomina('')
        ]);
        setCostos(costosRows);
        setHechos(hechosRows);
        setNomina(nominaRows);
      } catch (e) {
        setError(e.message);
      }
    };
    load();
  }, []);

  const kpis = useMemo(() => {
    const costoFases = costos.reduce((sum, row) => sum + (Number(row.costo_total_fase) || 0), 0);
    const kg = hechos.reduce((sum, row) => sum + (Number(row.kg_procesados) || 0), 0);
    const cajas = hechos.reduce((sum, row) => sum + (Number(row.cajas) || 0), 0);
    const rechazo = hechos.reduce((sum, row) => sum + (Number(row.kg_rechazo) || 0), 0);
    const horas = hechos.reduce((sum, row) => sum + (Number(row.horas_hombre) || 0), 0);
    const costoNomina = nomina.reduce((sum, row) => sum + (Number(row.costo_total) || 0), 0);
    return {
      costoFases,
      costoNomina,
      costoTotal: costoFases + costoNomina,
      kg,
      cajas,
      rechazo,
      horas,
      costoKg: kg > 0 ? (costoFases + costoNomina) / kg : 0,
      costoCaja: cajas > 0 ? (costoFases + costoNomina) / cajas : 0
    };
  }, [costos, hechos, nomina]);

  const costoPorFase = useMemo(() => {
    const map = {};
    costos.forEach((row) => {
      const key = row.expand?.fase_ref?.nombre || row.expand?.fase_ref?.codigo || 'Sin fase';
      map[key] = (map[key] || 0) + (Number(row.costo_total_fase) || 0);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [costos]);

  return (
    <>
      <Helmet><title>Dashboard de Costos | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard costo vs producción</h1>
          <p className="text-slate-500 mt-1">Datos reales de PocketBase integrados con producción.</p>
        </div>

        {error ? <div className="text-red-600 text-sm">{error}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Costo total período</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{formatCurrency(kpis.costoTotal)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Costo por kg</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{formatCurrency(kpis.costoKg)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Costo por caja</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{formatCurrency(kpis.costoCaja)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Kg procesados</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{kpis.kg.toLocaleString()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Cajas producidas</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{kpis.cajas.toLocaleString()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Rechazo (kg)</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{kpis.rechazo.toLocaleString()}</CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Costo total por fase</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b"><th className="py-2">Fase</th><th className="py-2 text-right">Costo</th></tr></thead>
              <tbody>
                {costoPorFase.map(([fase, total]) => (
                  <tr key={fase} className="border-b">
                    <td className="py-2">{fase}</td>
                    <td className="py-2 text-right font-mono">{formatCurrency(total)}</td>
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

export default DashboardPage;