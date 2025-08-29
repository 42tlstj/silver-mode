import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from './ui/utils';

interface AccessibleCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function AccessibleCard({ 
  title, 
  description, 
  children, 
  className,
  onClick,
  interactive = false
}: AccessibleCardProps) {
  return (
    <Card 
      className={cn(
        'border-2 shadow-lg',
        interactive && 'cursor-pointer hover:shadow-xl transition-all duration-200 hover:border-primary/50',
        className
      )}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {(title || description) && (
        <CardHeader className="pb-4">
          {title && <CardTitle className="text-2xl font-bold">{title}</CardTitle>}
          {description && <CardDescription className="text-lg text-muted-foreground mt-2">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="text-lg">
        {children}
      </CardContent>
    </Card>
  );
}