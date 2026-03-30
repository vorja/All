import React, { useState } from 'react';
import EmployeeKanbanCard from '@/components/EmployeeKanbanCard.jsx';
import { Badge } from '@/components/ui/badge';

const KanbanBoard = ({ columns, onEmployeeMove, onEdit, onDelete }) => {
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, newArea) => {
    e.preventDefault();
    const employeeId = e.dataTransfer.getData('employeeId');
    
    if (employeeId && onEmployeeMove) {
      onEmployeeMove(employeeId, newArea);
    }
    
    setDragOverColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const isOver = dragOverColumn === column.id;
        
        return (
          <div
            key={column.id}
            className={`flex-shrink-0 w-80 bg-slate-100 rounded-xl p-4 transition-all duration-200 ${
              isOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.title)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">{column.title}</h3>
              <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                {column.empleados.length}
              </Badge>
            </div>
            
            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
              {column.empleados.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Arrastra empleados aquí
                </div>
              ) : (
                column.empleados.map((employee) => (
                  <EmployeeKanbanCard
                    key={employee.id}
                    employee={employee}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;