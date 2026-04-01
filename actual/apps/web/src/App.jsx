import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LotsPage from './pages/LotsPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import VariableExpensesPage from './pages/VariableExpensesPage.jsx';
import QualityPage from './pages/QualityPage.jsx';
import InsumosPage from './pages/InsumosPage.jsx';
import SupplyIncomeExcelPage from './pages/SupplyIncomeExcelPage.jsx';
import PayrollPage from './pages/PayrollPage.jsx';
import PayrollIntakePage from './pages/PayrollIntakePage.jsx';
import ControlHorasPage from './pages/ControlHorasPage.jsx';
import EmpleadosPage from './pages/EmpleadosPage.jsx';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/lotes" element={<LotsPage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/gastos-variables" element={<VariableExpensesPage />} />
            <Route path="/calidad" element={<QualityPage />} />
            <Route path="/insumos" element={<InsumosPage />} />
            <Route path="/supply-income" element={<SupplyIncomeExcelPage />} />
            
            <Route path="/empleados" element={<EmpleadosPage />} /> 
            
            {/* Payroll Routes - Unprotected for all users */}
            <Route path="/nominas" element={<PayrollPage />} />
            <Route path="/ingreso-nominas" element={<PayrollIntakePage />} />
            <Route path="/control-horas" element={<ControlHorasPage />} />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;