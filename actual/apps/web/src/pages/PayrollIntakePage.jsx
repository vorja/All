import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, FileSpreadsheet, CheckCircle2, Table as TableIcon, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { parseExcelFile, validateData, generatePreview } from '@/lib/ExcelImportHelper.js';

const PayrollIntakePage = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [importHistory, setImportHistory] = useState([
    { id: 1, file: 'nomina_marzo_q1.xlsx', date: '15 Mar 2026, 10:30 AM', status: 'Exitoso' },
    { id: 2, file: 'nomina_febrero_q2.xlsx', date: '28 Feb 2026, 11:15 AM', status: 'Exitoso' },
  ]);
  const fileInputRef = useRef(null);

  const expectedSchema = {
    'Empleado': { required: true, type: 'string' },
    'Horas Regulares': { required: true, type: 'number' },
    'Valor Hora Regular': { required: true, type: 'number' },
    'Cantidad Horas Extra': { required: true, type: 'number' },
    'Valor Hora Extra': { required: true, type: 'number' },
    'Recargos Nocturnos': { required: true, type: 'number' },
    'Recargos Dominicales': { required: true, type: 'number' },
    'Deducciones': { required: true, type: 'number' },
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
        const dataWithTotal = validData.map(row => {
          const total = (row['Horas Regulares'] * row['Valor Hora Regular']) +
                        (row['Cantidad Horas Extra'] * row['Valor Hora Extra']) +
                        row['Recargos Nocturnos'] +
                        row['Recargos Dominicales'] -
                        row['Deducciones'];
          return {
            ...row,
            'Costo Total': total
          };
        });
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
    setIsProcessing(true);
    
    // Simulate API import
    // In a real scenario, we would map the data and send all fields EXCEPT costo_total
    // and set estado='Pendiente' by default.
    
    setTimeout(() => {
      const newHistory = {
        id: Date.now(),
        file: file.name,
        date: new Date().toLocaleString(),
        status: 'Exitoso'
      };
      
      setImportHistory([newHistory, ...importHistory].slice(0, 5));
      setFile(null);
      setPreviewData(null);
      setIsProcessing(false);
      toast.success('Nómina importada exitosamente.');
    }, 1500);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <>
      <Helmet><title>Ingreso de Nóminas | AGRICOL</title></Helmet>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ingreso de Nóminas</h1>
          <p className="text-slate-500 mt-1">Carga un archivo Excel con los datos de nómina para importación masiva.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-t-4 border-t-primary">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <UploadCloud className="h-5 w-5 text-primary" />
                  Cargar Archivo de Nómina
                </CardTitle>
                <CardDescription>
                  Sube un archivo .xlsx o .xls con la estructura requerida.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div 
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer ${
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
                  
                  {isProcessing && !previewData ? (
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
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center">
                        <FileSpreadsheet className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-slate-700 font-medium text-lg">Arrastra tu archivo Excel aquí o haz clic para seleccionar</p>
                        <p className="text-slate-500 text-sm mt-1">Archivos soportados: .xlsx, .xls, .csv</p>
                      </div>
                      <Button variant="outline" className="mt-2">Seleccionar Archivo</Button>
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

                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <TableIcon className="h-4 w-4 text-slate-500" />
                      Vista Previa de Datos
                    </h3>
                    {previewData ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Datos Válidos</Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-400 bg-slate-50">Esperando archivo...</Badge>
                    )}
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-slate-600 whitespace-nowrap">
                        <thead className="bg-slate-100 border-b border-slate-200 text-slate-500">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Empleado</th>
                            <th className="px-4 py-3 font-semibold text-center">H. Reg.</th>
                            <th className="px-4 py-3 font-semibold text-right">Valor H.R.</th>
                            <th className="px-4 py-3 font-semibold text-center">H. Ext.</th>
                            <th className="px-4 py-3 font-semibold text-right">Valor H.E.</th>
                            <th className="px-4 py-3 font-semibold text-right">R. Noct.</th>
                            <th className="px-4 py-3 font-semibold text-right">R. Dom.</th>
                            <th className="px-4 py-3 font-semibold text-right text-red-500">Deducciones</th>
                            <th className="px-4 py-3 font-semibold text-right text-slate-900">Costo Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {previewData ? (
                            previewData.map((row, i) => (
                              <tr key={i} className="bg-white">
                                <td className="px-4 py-2 font-medium text-slate-900">{row['Empleado']}</td>
                                <td className="px-4 py-2 text-center font-mono">{row['Horas Regulares']}</td>
                                <td className="px-4 py-2 text-right font-mono">{formatCurrency(row['Valor Hora Regular'])}</td>
                                <td className="px-4 py-2 text-center font-mono">{row['Cantidad Horas Extra']}</td>
                                <td className="px-4 py-2 text-right font-mono">{formatCurrency(row['Valor Hora Extra'])}</td>
                                <td className="px-4 py-2 text-right font-mono">{formatCurrency(row['Recargos Nocturnos'])}</td>
                                <td className="px-4 py-2 text-right font-mono">{formatCurrency(row['Recargos Dominicales'])}</td>
                                <td className="px-4 py-2 text-right font-mono text-red-600">{formatCurrency(row['Deducciones'])}</td>
                                <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">{formatCurrency(row['Costo Total'])}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="9" className="px-4 py-8 text-center text-slate-400">
                                Sube un archivo para visualizar los datos aquí.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white px-8"
                    disabled={!previewData || isProcessing}
                    onClick={handleImport}
                  >
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                    Importar Registros
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg">Estructura Requerida</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-sm text-slate-600 mb-4">
                  El archivo Excel debe contener exactamente las siguientes columnas en la primera fila:
                </p>
                <ul className="space-y-2 text-sm font-mono text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <li>• Empleado</li>
                  <li>• Horas Regulares</li>
                  <li>• Valor Hora Regular</li>
                  <li>• Cantidad Horas Extra</li>
                  <li>• Valor Hora Extra</li>
                  <li>• Recargos Nocturnos</li>
                  <li>• Recargos Dominicales</li>
                  <li>• Deducciones</li>
                  <li>• Fecha</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Historial de Importaciones</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-slate-100">
                  {importHistory.map((item) => (
                    <li key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-slate-900 text-sm truncate pr-2">{item.file}</span>
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] px-1.5 py-0 h-5 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> {item.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.date}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayrollIntakePage;