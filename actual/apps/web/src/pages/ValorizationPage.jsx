import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { RefreshCw, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PriceAssignmentModal from '@/components/PriceAssignmentModal.jsx';
import { useToast } from '@/hooks/use-toast.js';

const ValorizationPage = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReception, setSelectedReception] = useState(null);
  const [receptions, setReceptions] = useState([
    {
      id: 'REC-2026-0847',
      date: '2026-03-19 14:23',
      supplier: 'Finca El Paraíso',
      lot: 'LOT-847-A',
      weight: 342,
      wastePercentage: 4.2,
      status: 'pending',
    },
    {
      id: 'REC-2026-0846',
      date: '2026-03-19 09:15',
      supplier: 'Agrícola San José',
      lot: 'LOT-846-B',
      weight: 278,
      wastePercentage: 5.8,
      status: 'pending',
    },
    {
      id: 'REC-2026-0845',
      date: '2026-03-18 16:42',
      supplier: 'Platanera Los Andes',
      lot: 'LOT-845-C',
      weight: 456,
      wastePercentage: 3.1,
      status: 'valued',
    },
    {
      id: 'REC-2026-0844',
      date: '2026-03-18 11:30',
      supplier: 'Finca La Esperanza',
      lot: 'LOT-844-A',
      weight: 189,
      wastePercentage: 6.7,
      status: 'pending',
    },
    {
      id: 'REC-2026-0843',
      date: '2026-03-17 15:18',
      supplier: 'Agrícola Valle Verde',
      lot: 'LOT-843-D',
      weight: 523,
      wastePercentage: 2.9,
      status: 'valued',
    },
    {
      id: 'REC-2026-0842',
      date: '2026-03-17 10:05',
      supplier: 'Finca El Paraíso',
      lot: 'LOT-842-B',
      weight: 298,
      wastePercentage: 7.3,
      status: 'pending',
    },
    {
      id: 'REC-2026-0841',
      date: '2026-03-16 13:47',
      supplier: 'Platanera Los Andes',
      lot: 'LOT-841-A',
      weight: 412,
      wastePercentage: 4.8,
      status: 'valued',
    },
    {
      id: 'REC-2026-0840',
      date: '2026-03-16 08:22',
      supplier: 'Agrícola San José',
      lot: 'LOT-840-C',
      weight: 367,
      wastePercentage: 5.2,
      status: 'valued',
    },
  ]);

  const handleSyncData = () => {
    toast({
      title: 'Sincronización iniciada',
      description: 'Actualizando datos maestros desde World Office...',
    });
  };

  const handleAssignPrice = (reception) => {
    setSelectedReception(reception);
    setIsModalOpen(true);
  };

  const handleSavePrice = (updatedReception) => {
    setReceptions(receptions.map(r => 
      r.id === updatedReception.id 
        ? { ...r, status: 'valued' }
        : r
    ));
    toast({
      title: 'Precio asignado',
      description: `Valorización guardada para ${updatedReception.lot}`,
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pendiente de Precio
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Valorizado
      </Badge>
    );
  };

  return (
    <>
      <Helmet>
        <title>Valorización de Materia Prima | FinDash</title>
        <meta name="description" content="Panel de valorización de recepción de materia prima para producción de patacones" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              Valorización de Materia Prima
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestión de recepciones y asignación de precios
            </p>
          </div>
          <Button
            onClick={handleSyncData}
            className="bg-primary hover:bg-primary/90 transition-colors duration-200 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar Datos Maestros
          </Button>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden card-shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">ID Recepción</TableHead>
                <TableHead className="font-semibold text-gray-700">Fecha y Hora</TableHead>
                <TableHead className="font-semibold text-gray-700">Proveedor</TableHead>
                <TableHead className="font-semibold text-gray-700">Lote</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Peso Bruto (kg)</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">% Merma Inicial</TableHead>
                <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receptions.map((reception) => (
                <TableRow key={reception.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <TableCell className="font-medium text-gray-900">{reception.id}</TableCell>
                  <TableCell className="text-gray-700">{reception.date}</TableCell>
                  <TableCell className="text-gray-900">{reception.supplier}</TableCell>
                  <TableCell className="font-medium text-gray-900">{reception.lot}</TableCell>
                  <TableCell className="text-right font-medium text-gray-900">
                    {reception.weight.toLocaleString('es-CO')}
                  </TableCell>
                  <TableCell className="text-right text-gray-900">{reception.wastePercentage}%</TableCell>
                  <TableCell>{getStatusBadge(reception.status)}</TableCell>
                  <TableCell className="text-right">
                    {reception.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleAssignPrice(reception)}
                        className="bg-primary hover:bg-primary/90 transition-colors duration-200 active:scale-[0.98]"
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Asignar Precio
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <PriceAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reception={selectedReception}
        onSave={handleSavePrice}
      />
    </>
  );
};

export default ValorizationPage;