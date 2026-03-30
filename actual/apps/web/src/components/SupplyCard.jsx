import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash2 } from 'lucide-react';

export const SupplyCard = ({ supply, onIncrease, onDecrease, onDelete }) => {
  const isCritical = supply.stock <= supply.min;
  const isLow = supply.stock <= supply.min * 1.5 && !isCritical;

  return (
    <Card className="card-hover bg-card border-border flex flex-col h-full overflow-hidden">
      <div className="h-40 w-full overflow-hidden relative bg-muted">
        <img 
          src={supply.image} 
          alt={supply.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          {isCritical ? (
            <Badge variant="destructive" className="shadow-sm">CRÍTICO</Badge>
          ) : isLow ? (
            <Badge variant="warning" className="bg-warning text-warning-foreground shadow-sm">BAJO</Badge>
          ) : (
            <Badge variant="success" className="bg-success text-success-foreground shadow-sm">OK</Badge>
          )}
        </div>
      </div>
      
      <CardContent className="pt-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-foreground leading-tight">{supply.name}</h3>
          <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
            ${supply.cost.toLocaleString()}/{supply.unit}
          </span>
        </div>
        
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stock Actual:</span>
            <span className={`font-bold ${isCritical ? 'text-destructive' : 'text-foreground'}`}>
              {supply.stock} {supply.unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Mínimo Requerido:</span>
            <span className="font-medium text-foreground">{supply.min} {supply.unit}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-border pt-4 pb-4 gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onDecrease(supply.id)}
          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/10"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onIncrease(supply.id)}
          className="h-9 w-9 text-muted-foreground hover:text-success hover:border-success hover:bg-success/10"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <div className="flex-1"></div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(supply.id)}
          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};