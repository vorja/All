import React from 'react';
import { Helmet } from 'react-helmet';
import { Package, Box, Thermometer, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const BodegaPage = () => {
  return (
    <>
      <Helmet>
        <title>Bodega | FinDash</title>
      </Helmet>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Bodega y Almacenamiento</h1>
          <p className="text-muted-foreground mt-1">Resumen de capacidad y despachos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-shadow border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Plátano Disponible</p>
                <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">500 <span className="text-lg font-normal text-muted-foreground">kg</span></div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Insumos</p>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Box className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">52,195 <span className="text-lg font-normal text-muted-foreground">unidades</span></div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Ocupación Cuartos Fríos</p>
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Thermometer className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">78%</div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Lotes para Despacho</p>
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Truck className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">24</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BodegaPage;