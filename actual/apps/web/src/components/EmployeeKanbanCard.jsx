import React from 'react';
import { Factory, Users, Package, Truck, TrendingUp, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const areaIcons = {
  'Producción': Factory,
  'Administración': Users,
  'Empaque': Package,
  'Logística': Truck,
  'Ventas': TrendingUp
};

const areaBorderColors = {
  'Producción': 'border-l-blue-500',
  'Administración': 'border-l-purple-500',
  'Empaque': 'border-l-amber-500',
  'Logística': 'border-l-green-500',
  'Ventas': 'border-l-rose-500'
};

const EmployeeKanbanCard = ({ employee, onDragStart, onEdit, onDelete }) => {
  const Icon = areaIcons[employee.area] || Users;
  const borderColor = areaBorderColors[employee.area] || 'border-l-slate-500';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      maximumFractionDigits: 0 
    }).format(value);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('employeeId', employee.id);
    if (onDragStart) {
      onDragStart(employee);
    }
  };

  return (
    <Card 
      draggable="true"
      onDragStart={handleDragStart}
      className={`bg-white border border-slate-200 border-l-4 ${borderColor} hover:shadow-md transition-all duration-200 cursor-move group`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 bg-slate-100 rounded-lg shrink-0">
              <Icon className="h-5 w-5 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 text-sm truncate" title={employee.nombre}>
                {employee.nombre}
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5" title={employee.email}>
                {employee.email}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {employee.telefono}
              </p>
              <p className="text-sm font-medium text-slate-700 mt-2">
                {formatCurrency(employee.salario)}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit && onEdit(employee)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete && onDelete(employee)}
                className="text-rose-600 focus:text-rose-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeKanbanCard;