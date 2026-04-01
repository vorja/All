import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Mail, TrendingUp, ShieldCheck, BarChart3 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Por favor complete todos los campos.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      // Accept any non-empty credentials for demo purposes, or specific ones
      if (email === 'admin@findash.com' && password === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas. Use admin@findash.com / admin123');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <>
      <Helmet>
        <title>Acceso | FinDash Sistema de Costos</title>
      </Helmet>
      <div className="min-h-screen flex bg-background">
        
        {/* Left Side - Hero/Branding */}
        <div className="hidden lg:flex w-1/2 bg-[#0F172A] text-white flex-col justify-between p-12 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-orange-500 blur-[120px]"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-500 blur-[100px]"></div>
          </div>

          <div className="z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">FinDash</span>
            </div>
            
            <h1 className="text-5xl font-bold leading-tight mb-6 text-balance">
              Sistema Integral de <span className="text-orange-500">Gestión de Costos</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-12">
              Optimice la rentabilidad de su producción con control en tiempo real de OPEX, inventarios y mano de obra.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200">Análisis Financiero</h3>
                  <p className="text-sm text-slate-500">Métricas y KPIs actualizados al instante</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200">Control de Mermas</h3>
                  <p className="text-sm text-slate-500">Alertas automáticas de inventario crítico</p>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} FinDash Corp. Todos los derechos reservados.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">Bienvenido de nuevo</h2>
              <p className="text-muted-foreground mt-2">Ingrese a su panel de control financiero</p>
            </div>

            <Card className="border-border/50 shadow-xl shadow-slate-900/5">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="admin@findash.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background border-border focus-visible:ring-accent"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-foreground font-medium">Contraseña</Label>
                      <a href="#" className="text-sm text-accent hover:underline font-medium">¿Olvidó su contraseña?</a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-background border-border focus-visible:ring-accent"
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md border border-destructive/20 flex items-start gap-2">
                      <span className="block mt-0.5">⚠️</span>
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-4 bg-accent hover:bg-accent/90 text-white transition-all active:scale-[0.98] h-11 text-base font-medium" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Autenticando...' : 'Ingresar al Sistema'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <p className="text-center text-sm text-muted-foreground">
              Demo credentials: admin@findash.com / admin123
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;