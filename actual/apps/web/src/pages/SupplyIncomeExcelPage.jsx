import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { parseExcelFile, validateData, generatePreview } from '@/lib/ExcelImportHelper.js';

const SupplyIncomeExcelPage = () => {
  const [file, setFile] = useState(null);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [importHistory, setImportHistory] = useState([]);
  const fileInputRef = useRef(null);

  const expectedSchema = {
    'Insumo': { required: true, type: 'string' },
    'Cantidad Ingresada': { required: true, type: 'number' },
    'Costo Unitario': { required: true, type: 'number' },
    'Número de Factura': { required: true, type: 'string' },
    'Fecha': { required: true, type: 'string' }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = async (selectedFile) => {
    if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/)) {
      toast.error('Por favor suba un archivo Excel (.xlsx, .xls) o CSV.');
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    setPreviewData(null);
    setValidationErrors([]);

    try {
      const data = await parseExcelFile(selectedFile, Object.keys(expectedSchema));
      const { validData, errors, isValid } = validateData(data, expectedSchema);
      
      if (!isValid) {
        setValidationErrors(errors);
        toast.error('El archivo contiene errores de validación.');
      } else {
        // Calculate Costo Total for preview
        const dataWithTotal = validData.map(row => ({
          ...row,
          'Costo Total': row['Cantidad Ingresada'] * row['Costo Unitario']
        }));
        setPreviewData(generatePreview(dataWithTotal, 5));
        toast.success('Archivo procesado correctamente.');
      }
    } catch (error) {
      toast.error(error.message || 'Error al procesar el archivo.');
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (!invoiceFile) {
      toast.error('Debe adjuntar la evidencia de la factura.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API import
    // In a real scenario, we would map the data and send:
    // insumo_id, cantidad_ingresada, costo_unitario, numero_factura, fecha, estado='Registrado'
    // We DO NOT send costo_total_ingreso as the system calculates it.
    
    setTimeout(() => {
      const newHistory = {
        id: `IMP-${Date.now()}`,
        fecha: new Date().toLocaleString(),
        archivo: file.name,
        registros: previewData ? previewData.length : 0,
        estado: 'Exitoso'
      };
      
      setImportHistory([newHistory, ...importHistory].slice(0, 10));
      setFile(null);
      setInvoiceFile(null);
      setPreviewData(null);
      setIsProcessing(false);
      toast.success('Ingreso de insumos importado exitosamente.');
    }, 1500);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <>
      <Helmet><title>Ingreso de Insumos (Excel) | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ingreso Masivo de Insumos</h1>
          <p className="text-slate-500 mt-1">Importe registros de entrada mediante archivos Excel o CSV.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-t-4 border-t-primary">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  Cargar Archivo de Datos
                </CardTitle>
                <CardDescription>
                  El archivo debe contener las columnas: Insumo, Cantidad Ingresada, Costo Unitario, Número de Factura, Fecha.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div 
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".xlsx, .xls, .csv" 
                    onChange={handleFileSelect}
                  />
                  
                  {isProcessing ? (
                    <div className="flex flex-col items-center space-y-3">
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />
                      <p className="text-slate-600 font-medium">Procesando archivo...</p>
                    </div>
                  ) : file ? (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <FileSpreadsheet className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-slate-900 font-semibold text-lg">{file.name}</p>
                        <p className="text-slate-500 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewData(null); setValidationErrors([]); }}>
                        Cambiar archivo
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3 cursor-pointer">
                      <div className="w-16 h-16 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-2">
                        <UploadCloud className="h-8 w-8" />
                      </div>
                      <p className="text-slate-700 font-medium text-lg">Arrastre su archivo Excel aquí</p>
                      <p className="text-slate-500 text-sm">o haga clic para explorar</p>
                    </div>
                  )}
                </div>

                {validationErrors.length > 0 && (
                  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                      <AlertCircle className="h-5 w-5" />
                      Errores de Validación
                    </div>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1 ml-5">
                      {validationErrors.slice(0, 5).map((err, i) => (
                        <li key={i}>Fila {err.row}: {err.messages.join(' ')}</li>
                      ))}
                      {validationErrors.length > 5 && (
                        <li className="font-medium">...y {validationErrors.length - 5} errores más.</li>
                      )}
                    </ul>
                  </div>
                )}

                {previewData && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">Vista Previa (Primeras 5 filas)</h3>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Datos Válidos</Badge>
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                          <tr>
                            <th className="px-4 py-2 font-semibold">Insumo</th>
                            <th className="px-4 py-2 font-semibold text-right">Cantidad</th>
                            <th className="px-4 py-2 font-semibold text-right">Costo Unitario</th>
                            <th className="px-4 py-2 font-semibold text-right">Costo Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {previewData.map((row, i) => (
                            <tr key={i} className="bg-white">
                              <td className="px-4 py-2">{row['Insumo']}</td>
                              <td className="px-4 py-2 text-right font-mono">{row['Cantidad Ingresada']}</td>
                              <td className="px-4 py-2 text-right font-mono">{formatCurrency(row['Costo Unitario'])}</td>
                              <td className="px-4 py-2 text-right font-mono font-medium text-slate-900">{formatCurrency(row['Costo Total'])}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg">Evidencia y Confirmación</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-900">Factura (PDF/Imagen) <span className="text-red-500">*</span></Label>
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative">
                    <Input 
                      type="file" 
                      accept=".pdf,image/*"
                      onChange={(e) => setInvoiceFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center gap-3 pointer-events-none">
                      <FileText className="h-8 w-8 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {invoiceFile ? invoiceFile.name : 'Adjuntar archivo...'}
                        </p>
                        <p className="text-xs text-slate-500">Max 20MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold"
                  disabled={!previewData || !invoiceFile || isProcessing}
                  onClick={handleImport}
                >
                  {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                  Importar Registros
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Historial Reciente</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {importHistory.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500">No hay importaciones recientes.</div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {importHistory.map((item) => (
                      <li key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-slate-900 text-sm truncate pr-2">{item.archivo}</span>
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] px-1.5 py-0 h-5">Exitoso</Badge>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{item.fecha}</span>
                          <span>{item.registros} registros</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplyIncomeExcelPage;