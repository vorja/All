import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Activity, ShieldCheck, Box, FileSpreadsheet, Users, UploadCloud, Clock, Briefcase } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const mainLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/lotes', icon: Package, label: 'Lotes' },
    { to: '/calidad', icon: ShieldCheck, label: 'Control de Calidad' },
    { to: '/servicios', icon: Activity, label: 'Servicios' },
  ];

  const inventoryLinks = [
    { to: '/insumos', icon: Box, label: 'Insumos' },
    { to: '/supply-income', icon: FileSpreadsheet, label: 'Ingreso de Insumos' },
  ];

  const peopleLinks = [
    { to: '/empleados', icon: Briefcase, label: 'Gestión de Personal' },
  ];

  const hrLinks = [
    { to: '/nominas', icon: Users, label: 'Ver Nóminas' },
    { to: '/ingreso-nominas', icon: UploadCloud, label: 'Ingreso de Nóminas' },
    { to: '/control-horas', icon: Clock, label: 'Control de Horas' },
  ];

  const renderLinks = (links) => {
    return links.map((link) => {
      const Icon = link.icon;
      const isActive = location.pathname.startsWith(link.to);
      return (
        <Link
          key={link.to}
          to={link.to}
          className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group relative ${
            isActive
              ? 'bg-emerald-800/80 text-white shadow-sm'
              : 'text-emerald-100/70 hover:bg-emerald-800/50 hover:text-white'
          }`}
        >
          <Icon className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'text-emerald-400/60 group-hover:text-emerald-300'}`} />
          <span className="text-sm font-medium">{link.label}</span>
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-400 rounded-r-full" />
          )}
        </Link>
      );
    });
  };

  return (
    <aside className="w-64 bg-emerald-950 border-r border-emerald-900/50 flex flex-col h-full flex-shrink-0 transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-emerald-900/50">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
          <Activity className="h-5 w-5 text-emerald-950" />
        </div>
        <h1 className="font-extrabold text-white text-xl tracking-tight">AGRICOL</h1>
      </div>

      <div className="pt-6 pb-2 overflow-hidden flex-1 flex flex-col">
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar pb-6">
          <div className="space-y-1.5">
            <p className="px-3 text-[11px] font-bold text-emerald-400/50 uppercase tracking-widest mb-2">Principal</p>
            {renderLinks(mainLinks)}
          </div>

          <div className="space-y-1.5">
            <p className="px-3 text-[11px] font-bold text-emerald-400/50 uppercase tracking-widest mb-2">Inventario</p>
            {renderLinks(inventoryLinks)}
          </div>

          <div className="space-y-1.5">
            <p className="px-3 text-[11px] font-bold text-emerald-400/50 uppercase tracking-widest mb-2">Personal</p>
            {renderLinks(peopleLinks)}
          </div>

          <div className="space-y-1.5">
            <p className="px-3 text-[11px] font-bold text-emerald-400/50 uppercase tracking-widest mb-2">Finanzas y Asistencia</p>
            {renderLinks(hrLinks)}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;