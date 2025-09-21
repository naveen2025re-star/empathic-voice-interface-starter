"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { SalesMetrics } from "@/utils/salesCoaching";

interface PerformanceStatsProps {
  averageMetrics: SalesMetrics;
}

export function PerformanceStats({ averageMetrics }: PerformanceStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="size-5" />
          Overall Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(averageMetrics).filter(([key]) => key !== 'overall_score').map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-sm font-medium text-muted-foreground capitalize mb-1">{key}</div>
              <div className="text-xl font-bold">{Math.round(value)}%</div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}