import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Factory, LineChart, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Inicio | FinDash</title>
      </Helmet>
      <div className="space-y-8 max-w-5xl mx-auto pt-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Bienvenido a FinDash</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Seleccione el flujo de trabajo que desea gestionar hoy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flow 1: Producción */}
          <Card className="card-shadow card-hover overflow-hidden group border-border/50 bg-card/50">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Factory className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Flujo de Producción</h2>
              <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">
                Gestione el personal en planta, controle el inventario de insumos y supervise el estado de la bodega de producto terminado.
              </p>
              <Button 
                onClick={() => navigate('/empleados')} 
                className="w-full group/btn"
                size="lg"
              >
                Ir a Producción
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Flow 2: Costos */}
          <Card className="card-shadow card-hover overflow-hidden group border-border/50 bg-card/50">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <LineChart className="h-7 w-7 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Panel de Costos</h2>
              <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">
                Analice la rentabilidad, revise los gastos operativos (OPEX), controle las mermas y evalúe los costos de mano de obra.
              </p>
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="secondary"
                className="w-full group/btn bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                size="lg"
              >
                Ir a Costos
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HomePage;