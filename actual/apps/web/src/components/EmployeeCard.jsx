import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, User } from 'lucide-react';

export const EmployeeCard = ({ employee }) => {
  return (
    <Card className="mb-3 cursor-grab active:cursor-grabbing bg-card border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-4 flex items-center gap-3">
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{employee.name}</p>
          <p className="text-xs text-muted-foreground">{employee.role}</p>
        </div>
      </CardContent>
    </Card>
  );
};