"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { CheckCircle, Circle, AlertCircle, TrendingUp } from "lucide-react";

interface QualificationCriteria {
  id: string;
  label: string;
  weight: number;
  status: 'pending' | 'verified' | 'failed';
  description: string;
}

interface LeadQualificationProps {
  onQualificationUpdate: (score: number, criteria: QualificationCriteria[]) => void;
}

export default function LeadQualification({ onQualificationUpdate }: LeadQualificationProps) {
  const [criteria, setCriteria] = useState<QualificationCriteria[]>([
    {
      id: 'budget',
      label: 'Budget Confirmed',
      weight: 25,
      status: 'pending',
      description: 'Has confirmed budget for solution'
    },
    {
      id: 'authority',
      label: 'Decision Maker',
      weight: 20,
      status: 'pending',
      description: 'Is the decision maker or has access to them'
    },
    {
      id: 'need',
      label: 'Clear Need',
      weight: 20,
      status: 'pending',
      description: 'Has expressed clear pain point or need'
    },
    {
      id: 'timeline',
      label: 'Timeline Defined',
      weight: 15,
      status: 'pending',
      description: 'Has defined timeline for implementation'
    },
    {
      id: 'fit',
      label: 'Product Fit',
      weight: 10,
      status: 'pending',
      description: 'Our solution fits their requirements'
    },
    {
      id: 'competition',
      label: 'Competitive Position',
      weight: 10,
      status: 'pending',
      description: 'We have competitive advantage'
    }
  ]);

  const updateCriteria = (id: string, status: 'verified' | 'failed') => {
    const updatedCriteria = criteria.map(c => 
      c.id === id ? { ...c, status } : c
    );
    setCriteria(updatedCriteria);

    // Calculate qualification score
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    const achievedWeight = updatedCriteria
      .filter(c => c.status === 'verified')
      .reduce((sum, c) => sum + c.weight, 0);
    
    const score = (achievedWeight / totalWeight) * 100;
    onQualificationUpdate(score, updatedCriteria);
  };

  const getQualificationLevel = (score: number) => {
    if (score >= 80) return { level: 'Hot Lead', color: 'bg-green-500', icon: '🔥' };
    if (score >= 60) return { level: 'Warm Lead', color: 'bg-yellow-500', icon: '⚡' };
    if (score >= 40) return { level: 'Cold Lead', color: 'bg-blue-500', icon: '❄️' };
    return { level: 'Unqualified', color: 'bg-gray-500', icon: '⭕' };
  };

  const totalScore = criteria
    .filter(c => c.status === 'verified')
    .reduce((sum, c) => sum + c.weight, 0);

  const qualification = getQualificationLevel(totalScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Lead Qualification (BANT+)
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className={qualification.color}>
            {qualification.icon} {qualification.level}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Score: {totalScore}%
          </span>
        </div>
        <Progress value={totalScore} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-3">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {criterion.status === 'verified' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : criterion.status === 'failed' ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
                <span className="font-medium text-sm">{criterion.label}</span>
                <Badge variant="outline" className="text-xs">
                  {criterion.weight}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{criterion.description}</p>
            </div>
            <div className="flex gap-1 ml-2">
              <Button
                size="sm"
                variant={criterion.status === 'verified' ? 'default' : 'outline'}
                onClick={() => updateCriteria(criterion.id, 'verified')}
                className="h-7 px-2"
              >
                ✓
              </Button>
              <Button
                size="sm"
                variant={criterion.status === 'failed' ? 'destructive' : 'outline'}
                onClick={() => updateCriteria(criterion.id, 'failed')}
                className="h-7 px-2"
              >
                ✗
              </Button>
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="font-medium text-sm mb-2">Next Actions:</h4>
          <div className="text-xs space-y-1">
            {totalScore >= 80 && (
              <p className="text-green-600">🎯 High-quality lead! Schedule demo immediately.</p>
            )}
            {totalScore >= 60 && totalScore < 80 && (
              <p className="text-yellow-600">⚡ Good potential. Address missing criteria.</p>
            )}
            {totalScore >= 40 && totalScore < 60 && (
              <p className="text-blue-600">❄️ Needs nurturing. Focus on building value.</p>
            )}
            {totalScore < 40 && (
              <p className="text-gray-600">⭕ Low qualification. Consider other priorities.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}