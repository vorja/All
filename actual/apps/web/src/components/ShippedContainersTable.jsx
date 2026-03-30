import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ShippedContainersTable = () => {
  const shippedContainers = [
    {
      id: 1,
      date: '2026-03-15',
      destination: 'Bogotá',
      boxes: 847,
      productionCost: 12450000,
      logisticsCost: 2340000,
      grossProfit: 4870000,
    },
    {
      id: 2,
      date: '2026-03-14',
      destination: 'Medellín',
      boxes: 623,
      productionCost: 9180000,
      logisticsCost: 1890000,
      grossProfit: 3520000,
    },
    {
      id: 3,
      date: '2026-03-13',
      destination: 'Cali',
      boxes: 734,
      productionCost: 10820000,
      logisticsCost: 2120000,
      grossProfit: 4180000,
    },
    {
      id: 4,
      date: '2026-03-12',
      destination: 'Barranquilla',
      boxes: 512,
      productionCost: 7540000,
      logisticsCost: 2680000,
      grossProfit: 2890000,
    },
    {
      id: 5,
      date: '2026-03-11',
      destination: 'Cartagena',
      boxes: 689,
      productionCost: 10150000,
      logisticsCost: 2890000,
      grossProfit: 3760000,
    },
    {
      id: 6,
      date: '2026-03-10',
      destination: 'Bucaramanga',
      boxes: 456,
      productionCost: 6720000,
      logisticsCost: 1560000,
      grossProfit: 2340000,
    },
    {
      id: 7,
      date: '2026-03-09',
      destination: 'Pereira',
      boxes: 378,
      productionCost: 5570000,
      logisticsCost: 1230000,
      grossProfit: 1890000,
    },
    {
      id: 8,
      date: '2026-03-08',
      destination: 'Santa Marta',
      boxes: 591,
      productionCost: 8710000,
      logisticsCost: 2450000,
      grossProfit: 3120000,
    },
  ];

  const formatCurrency = (value) => {
    return `$${value.toLocaleString('es-CO')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700">Fecha Despacho</TableHead>
            <TableHead className="font-semibold text-gray-700">Destino</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">Total Cajas</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">Costo Producción</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">Gastos Logísticos</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">Utilidad Bruta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shippedContainers.map((container) => (
            <TableRow key={container.id} className="hover:bg-gray-50 transition-colors duration-150">
              <TableCell className="font-medium text-gray-900">{formatDate(container.date)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-medium">
                  {container.destination}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {container.boxes.toLocaleString('es-CO')}
              </TableCell>
              <TableCell className="text-right text-gray-900">{formatCurrency(container.productionCost)}</TableCell>
              <TableCell className="text-right text-gray-900">{formatCurrency(container.logisticsCost)}</TableCell>
              <TableCell className="text-right">
                <span className="font-semibold text-primary">{formatCurrency(container.grossProfit)}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShippedContainersTable;