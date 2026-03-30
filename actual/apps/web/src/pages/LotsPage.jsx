import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { listLotesConProduccion, valorizarRecepcionLote } from '@/repositories/produccionRepository.js';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const formatCop = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

const formatKg = (value) =>
  new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(Number(value) || 0);

const LotsPage = () => {
  const [lots, setLots] = useState([]);
  const [error, setError] = useState('');
  const [sourceWarning, setSourceWarning] = useState('');
  const [sourceUsed, setSourceUsed] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    estado: 'todos'
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [precioInput, setPrecioInput] = useState('');
  const [saving, setSaving] = useState(false);

  const loadLots = () => {
    setLoading(true);
    setError('');
    listLotesConProduccion(filters)
      .then((result) => {
        setLots(result.lotes || []);
        setSourceWarning(result.sourceWarning || '');
        setSourceUsed(result.sourceUsed || '');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLots();
  }, []);

  const totalPreview = useMemo(() => {
    if (!selectedLot) return 0;
    const kg = Number(selectedLot.kg_recibidos || 0);
    const p = Number(precioInput);
    if (!Number.isFinite(p) || p < 0) return 0;
    return kg * p;
  }, [selectedLot, precioInput]);

  const openValorizar = (lot) => {
    if (lot.estado_valorizacion === 'Valorizado') return;
    setSelectedLot(lot);
    setPrecioInput(
      lot.precio_kg > 0 ? String(Math.round(lot.precio_kg)) : ''
    );
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedLot(null);
    setPrecioInput('');
  };

  const handleGuardar = async () => {
    const precio = Number(precioInput);
    if (!selectedLot || !Number.isFinite(precio) || precio < 0) {
      toast({
        title: 'Precio inválido',
        description: 'Ingresa un precio por kg válido (COP).',
        variant: 'destructive'
      });
      return;
    }
    setSaving(true);
    try {
      await valorizarRecepcionLote(selectedLot.recepcion_id, precio);
      toast({
        title: 'Lote valorizado',
        description: 'Los costos se guardaron en PocketBase.'
      });
      closeDialog();
      loadLots();
    } catch (e) {
      toast({
        title: 'Error al guardar',
        description: e.message || 'No se pudo completar la operación.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Valorización MP | Recepción</title>
      </Helmet>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Valorización de lotes de materia prima
          </h1>
          <p className="text-muted-foreground mt-1">
            Ingresos crudos desde recepción (MySQL), costos en PocketBase.
          </p>
        </div>

        {sourceUsed ? (
          <p className="text-xs text-muted-foreground">
            Fuente: <span className="font-mono">{sourceUsed}</span>
          </p>
        ) : null}

        {(error ||
          sourceWarning ||
          (!loading && lots.length === 0)) ? (
          <Alert variant="destructive" className="border-destructive/80">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {error ? 'Error al cargar lotes' : 'Aviso sobre los datos'}
            </AlertTitle>
            <AlertDescription className="font-mono text-xs whitespace-pre-wrap break-words">
              {error ||
                sourceWarning ||
                'No hay registros en la tabla para los filtros aplicados o la lista está vacía.'}
            </AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filtros</CardTitle>
            <CardDescription>Rango de fechas y estado de valorización.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div className="space-y-2">
                <Label htmlFor="from">Desde</Label>
                <Input
                  id="from"
                  type="date"
                  value={filters.from}
                  onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">Hasta</Label>
                <Input
                  id="to"
                  type="date"
                  value={filters.to}
                  onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={filters.estado}
                  onChange={(e) => setFilters((p) => ({ ...p, estado: e.target.value }))}
                >
                  <option value="todos">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="valorizado">Valorizado</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={loadLots} disabled={loading}>
                  {loading ? 'Cargando…' : 'Aplicar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFilters({ from: '', to: '', estado: 'todos' });
                  }}
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-primary shadow-sm">
          <CardHeader>
            <CardTitle>Lotes de recepción</CardTitle>
            <CardDescription>
              Datos de <code className="text-xs bg-muted px-1 rounded">bd_patacon.registro_recepcion_materia_prima</code>
              {' '}cruzados con costos en PocketBase (<code className="text-xs bg-muted px-1 rounded">lotes_produccion_ext</code>).
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote ID</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="text-right">Cantidad (kg)</TableHead>
                  <TableHead className="text-right">Precio / kg</TableHead>
                  <TableHead className="text-right">Valor total</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right w-[120px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lots.map((lot) => (
                  <TableRow
                    key={lot.id}
                    className={
                      lot.estado_valorizacion === 'Pendiente'
                        ? 'cursor-pointer hover:bg-muted/80'
                        : 'hover:bg-muted/40'
                    }
                    onClick={() => {
                      if (lot.estado_valorizacion === 'Pendiente') openValorizar(lot);
                    }}
                  >
                    <TableCell className="font-mono font-medium">{lot.lote_codigo}</TableCell>
                    <TableCell>{lot.proveedor}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatKg(lot.kg_recibidos)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCop(lot.precio_kg)}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">{formatCop(lot.valor_total)}</TableCell>
                    <TableCell className="text-muted-foreground">{lot.fecha_recepcion || '—'}</TableCell>
                    <TableCell>
                      {lot.estado_valorizacion === 'Valorizado' ? (
                        <Badge className="bg-emerald-800 text-white border-transparent hover:bg-emerald-800">
                          Valorizado
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-950 border-amber-200"
                        >
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      {lot.estado_valorizacion === 'Pendiente' ? (
                        <Button size="sm" variant="default" onClick={() => openValorizar(lot)}>
                          Valorizar
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Valorizar lote</DialogTitle>
          </DialogHeader>
          {selectedLot ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card className="shadow-none border bg-muted/30">
                  <CardHeader className="p-3 pb-0">
                    <CardDescription>Proveedor</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 text-sm font-medium">{selectedLot.proveedor}</CardContent>
                </Card>
                <Card className="shadow-none border bg-muted/30">
                  <CardHeader className="p-3 pb-0">
                    <CardDescription>Lote ID</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 text-sm font-mono font-medium">{selectedLot.lote_codigo}</CardContent>
                </Card>
                <Card className="shadow-none border bg-muted/30">
                  <CardHeader className="p-3 pb-0">
                    <CardDescription>Tipo / producto</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 text-sm">{selectedLot.tipo_platano}</CardContent>
                </Card>
                <Card className="shadow-none border bg-muted/30">
                  <CardHeader className="p-3 pb-0">
                    <CardDescription>Variedad</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 text-sm">{selectedLot.variedad || '—'}</CardContent>
                </Card>
                <Card className="shadow-none border bg-muted/30 col-span-2">
                  <CardHeader className="p-3 pb-0">
                    <CardDescription>Cantidad recibida (kg)</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 text-lg font-semibold tabular-nums">
                    {formatKg(selectedLot.kg_recibidos)} kg
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <Label htmlFor="precioKg">Precio por kg (COP)</Label>
                <Input
                  id="precioKg"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  placeholder="Ej. 1200"
                  value={precioInput}
                  onChange={(e) => setPrecioInput(e.target.value)}
                />
              </div>

              <div className="rounded-lg border bg-primary/5 p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Valor total estimado (COP)</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">{formatCop(totalPreview)}</p>
              </div>
            </div>
          ) : null}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleGuardar} disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LotsPage;
