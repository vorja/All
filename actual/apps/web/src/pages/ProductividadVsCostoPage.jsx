import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listCostosByRange } from '@/repositories/costosRepository.js';
import { listHechosByRange } from '@/repositories/produccionRepository.js';

const today = new Date().toISOString().slice(0, 10);
const firstDay = `${today.slice(0, 8)}01`;
const formatCurrency = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v || 0);

const ProductividadVsCostoPage = () => {
  const [costos, setCostos] = useState([]);
  const [hechos, setHechos] = useState([]);

  useEffect(() => {
    Promise.all([listCostosByRange(firstDay, today), listHechosByRange(firstDay, today)]).then(([c, h]) => {
      setCostos(c);
      setHechos(h);
    });
  }, []);

  const stats = useMemo(() => {
    const costo = costos.reduce((sum, row) => sum + Number(row.costo_total_fase || 0), 0);
    const horas = hechos.reduce((sum, row) => sum + Number(row.horas_hombre || 0), 0);
    const kg = hechos.reduce((sum, row) => sum + Number(row.kg_procesados || 0), 0);
    const gas = hechos.reduce((sum, row) => sum + Number(row.gas_m3 || 0), 0);
    const energia = hechos.reduce((sum, row) => sum + Number(row.energia_kwh || 0), 0);
    return {
      costo,
      horas,
      kg,
      gas,
      energia,
      kgPorHora: horas > 0 ? kg / horas : 0,
      costoPorHora: horas > 0 ? costo / horas : 0
    };
  }, [costos, hechos]);

  return (
    <>
      <Helmet><title>Productividad vs Costo | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Productividad vs costo</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Kg por hora-hombre</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stats.kgPorHora.toFixed(2)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Costo por hora-hombre</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{formatCurrency(stats.costoPorHora)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Costo total operativo</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{formatCurrency(stats.costo)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Gas (m3)</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stats.gas.toLocaleString()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Energia (kWh)</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stats.energia.toLocaleString()}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Kg procesados</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stats.kg.toLocaleString()}</CardContent></Card>
        </div>
      </div>
    </>
  );
};

export default ProductividadVsCostoPage;
