import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MeasurementsPage = () => {
  const daysInMonth = 31;
  const initialData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    agua: '', gas: '', energia: ''
  }));

  const [readings, setReadings] = useState(() => {
    const saved = localStorage.getItem('medidores-data');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [arriendo, setArriendo] = useState(() => localStorage.getItem('arriendo-val') || '1000000');

  useEffect(() => {
    localStorage.setItem('medidores-data', JSON.stringify(readings));
    localStorage.setItem('arriendo-val', arriendo);
  }, [readings, arriendo]);

  const handleReadingChange = (dayIndex, field, value) => {
    const newReadings = [...readings];
    newReadings[dayIndex][field] = value;
    setReadings(newReadings);
  };

  const calculateDelta = (dayIndex, field) => {
    if (dayIndex === 0) return 0;
    const current = parseFloat(readings[dayIndex][field]);
    const prev = parseFloat(readings[dayIndex - 1][field]);
    if (isNaN(current) || isNaN(prev)) return 0;
    return Math.max(0, current - prev);
  };

  const tarifas = { agua: 2500, gas: 1800, energia: 850 };

  return (
    <>
      <Helmet><title>Medidores y Servicios | FinDash</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Control de Medidores</h1>
          <p className="text-muted-foreground mt-1">Registro diario de consumos y cálculo de servicios.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-3 card-shadow overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
              <table className="w-full text-sm text-left spreadsheet-table relative">
                <thead className="sticky top-0 z-10 bg-muted">
                  <tr>
                    <th className="w-16 text-center">Día</th>
                    <th className="text-center bg-blue-500/10 text-blue-700 dark:text-blue-400">Agua (m³)</th>
                    <th className="text-center bg-orange-500/10 text-orange-700 dark:text-orange-400">Gas (m³)</th>
                    <th className="text-center bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">Energía (kWh)</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((row, idx) => (
                    <tr key={row.day}>
                      <td className="text-center font-medium bg-muted/30">{row.day}</td>
                      {['agua', 'gas', 'energia'].map(field => {
                        const delta = calculateDelta(idx, field);
                        const cost = delta * tarifas[field];
                        return (
                          <td key={field} className="p-1 align-top">
                            <input
                              type="number"
                              className="spreadsheet-input text-foreground"
                              value={row[field]}
                              onChange={(e) => handleReadingChange(idx, field, e.target.value)}
                              placeholder="Lectura"
                            />
                            {idx > 0 && row[field] && (
                              <div className="flex justify-between text-[10px] px-1 mt-1 text-muted-foreground">
                                <span>Δ: {delta.toFixed(1)}</span>
                                <span>${cost.toLocaleString()}</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Costos Fijos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Arriendo Mensual ($)</Label>
                  <Input 
                    type="number" 
                    value={arriendo} 
                    onChange={(e) => setArriendo(e.target.value)}
                    className="text-foreground font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Prorrateo diario: ${(parseFloat(arriendo || 0) / daysInMonth).toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tarifas Referencia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Agua:</span> <span className="font-mono">${tarifas.agua}/m³</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Gas:</span> <span className="font-mono">${tarifas.gas}/m³</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Energía:</span> <span className="font-mono">${tarifas.energia}/kWh</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeasurementsPage;