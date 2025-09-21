"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { salesScriptTemplates } from "@/utils/salesCoaching";
import { Play, BookOpen, Target } from "lucide-react";

interface SalesScriptSelectorProps {
  onScriptSelect: (script: string, title: string) => void;
  isConnected: boolean;
}

export default function SalesScriptSelector({ onScriptSelect, isConnected }: SalesScriptSelectorProps) {
  const [selectedScript, setSelectedScript] = useState<string | null>(null);

  const handlePractice = (scriptKey: string) => {
    const script = salesScriptTemplates[scriptKey as keyof typeof salesScriptTemplates];
    setSelectedScript(scriptKey);
    onScriptSelect(script.script, script.title);
  };

  if (isConnected) {
    return null;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Practice Your Sales Skills</h1>
        <p className="text-muted-foreground">Choose a sales scenario to practice with AI-powered emotion coaching</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {Object.entries(salesScriptTemplates).map(([key, template]) => (
          <Card key={key} className={`cursor-pointer transition-all hover:shadow-md ${selectedScript === key ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-5" />
                {template.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {template.script.length > 100 ? `${template.script.substring(0, 100)}...` : template.script}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handlePractice(key)} 
                className="w-full"
                variant={selectedScript === key ? "default" : "outline"}
              >
                <Play className="size-4 mr-2" />
                Practice This Script
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Target className="size-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">How EmotiClose Works</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Choose a sales script and start practicing</li>
                <li>• AI analyzes your voice emotions in real-time</li>
                <li>• Get instant coaching feedback on confidence, enthusiasm, and delivery</li>
                <li>• Track your progress and improve your closing rate</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}