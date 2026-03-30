import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { usePayrollCalculation } from '@/hooks/useCalculations.js';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B', '#14B8A6'];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
};

const CostDetailModal = ({ isOpen, onClose, title, tableData, columns, subtotalsByCategory, totalCost, chartType, chartData, rawData, dataType }) => {
  const payrollCalc = usePayrollCalculation(dataType === 'nominas' ? rawData : []);

  let finalTableData = tableData || [];
  let finalTotalCost = totalCost || 0;
  let finalChartData = chartData || [];
  let finalColumns = columns || [];
  let finalChartType = chartType || 'pie';

  if (dataType === 'nominas') {
    finalTableData = payrollCalc.calculatedData;
    finalTotalCost = payrollCalc.totalCostGeneral;
    finalChartData = payrollCalc.calculatedData.map(n => ({ name: n.empleado, value: n.costo_total }));
    finalChartType = 'bar';
    finalColumns = [
      { header: 'Empleado', accessor: 'empleado', isBold: true },
      { header: 'H. Regulares', accessor: 'horas_regulares_trabajadas', align: 'center' },
      { header: 'Valor H.R.', accessor: 'valor_hora_regular', align: 'right', format: 'currency' },
      { header: 'H. Extra', accessor: 'cantidad_horas_extras', align: 'center' },
      { header: 'Valor H.E.', accessor: 'valor_hora_extra', align: 'right', format: 'currency' },
      { header: 'R. Noct.', accessor: 'recargos_nocturnos', align: 'right', format: 'currency' },
      { header: 'R. Dom.', accessor: 'recargos_dominicales', align: 'right', format: 'currency' },
      { header: 'Deducciones', accessor: 'deducciones', align: 'right', format: 'currency' },
      { header: 'Costo Total', accessor: 'costo_total', align: 'right', format: 'currency', isBold: true }
    ];
  }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 py-4">
          {/* Chart Section */}
          {finalChartData && finalChartData.length > 0 && (
            <div className="h-[350px] w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                {finalChartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={finalChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {finalChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                ) : dataType === 'nominas' ? (
                  <BarChart data={finalChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fontSize: 11 }} interval={0} height={60} />
                    <YAxis tickFormatter={(val) => `$${val/1000}k`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: '#F1F5F9' }} />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <BarChart data={finalChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                    <XAxis type="number" tickFormatter={(val) => `$${val/1000}k`} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}

          {/* Subtotals Section */}
          {subtotalsByCategory && subtotalsByCategory.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subtotalsByCategory.map((sub, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{sub.label}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(sub.value)}</p>
                </div>
              ))}
            </div>
          )}

          {/* Detailed Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    {finalColumns.map((col, idx) => (
                      <th key={idx} className={`px-4 py-3 font-semibold ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}>
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {finalTableData.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-slate-50/50 transition-colors bg-white">
                      {finalColumns.map((col, colIdx) => (
                        <td key={colIdx} className={`px-4 py-3 ${col.align === 'right' ? 'text-right font-mono' : col.align === 'center' ? 'text-center font-mono' : ''} ${col.isBold ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                          {col.format === 'currency' ? formatCurrency(row[col.accessor]) : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                  <tr>
                    <td colSpan={finalColumns.length - 1} className="px-4 py-5 font-extrabold text-slate-900 text-right text-lg uppercase tracking-wider">
                      Total General:
                    </td>
                    <td className="px-4 py-5 font-extrabold text-primary text-right font-mono text-xl bg-primary/10">
                      {formatCurrency(finalTotalCost)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CostDetailModal;