import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Stock Óptimo':
      case 'Activo':
        return 'bg-primary/20 text-primary hover:bg-primary/30';
      case 'Stock Bajo':
      case 'Pendiente':
        return 'bg-warning/20 text-warning hover:bg-warning/30';
      case 'Stock Crítico':
      case 'Inactivo':
        return 'bg-destructive/20 text-destructive hover:bg-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge className={cn("font-medium border-none", getStatusColor(status))}>
      {status}
    </Badge>
  );
};