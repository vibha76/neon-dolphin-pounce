"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColorClass?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, title, description, iconColorClass = "text-primary" }) => {
  return (
    <Card className="flex items-center p-4 space-x-4">
      <div className={`flex-shrink-0 ${iconColorClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
};

export default InfoCard;