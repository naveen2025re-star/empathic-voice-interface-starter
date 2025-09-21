"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { salesScriptTemplates, type SalesScenario } from "@/utils/salesCoaching";
import { Play, BookOpen, Target, Zap, Users } from "lucide-react";
import AdvancedScenarioSelector from "./AdvancedScenarioSelector";

interface SalesScriptSelectorProps {
  onScriptSelect: (script: string, title: string, scenario?: SalesScenario) => void;
  isConnected: boolean;
}

export default function SalesScriptSelector({ onScriptSelect, isConnected }: SalesScriptSelectorProps) {
  const [selectedScript, setSelectedScript] = useState<string | null>(null);

  const handleClassicPractice = (scriptKey: string) => {
    const script = salesScriptTemplates[scriptKey as keyof typeof salesScriptTemplates];
    setSelectedScript(scriptKey);
    onScriptSelect(script.script, script.title);
  };

  if (isConnected) {
    return null;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">EmotiClose Sales Training</h1>
        <p className="text-muted-foreground">Master your sales skills with AI-powered emotion coaching</p>
      </div>

      <Tabs defaultValue="classic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="classic" className="flex items-center gap-2">
            <BookOpen className="size-4" />
            Classic Practice
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Users className="size-4" />
            Advanced Role-Playing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classic" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Quick Practice Scripts</h2>
            <p className="text-muted-foreground">Perfect for warming up and practicing core sales techniques</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {Object.entries(salesScriptTemplates).map(([key, template]) => (
              <Card key={key} className={`cursor-pointer transition-all hover:shadow-md ${selectedScript === key ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">Classic</Badge>
                    <Zap className="size-4 text-primary" />
                  </div>
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
                    onClick={() => handleClassicPractice(key)} 
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
                  <h3 className="font-semibold mb-2">Classic Practice Features</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Quick 2-3 minute practice sessions</li>
                    <li>• Core sales scripts and techniques</li>
                    <li>• Real-time emotion analysis and feedback</li>
                    <li>• Perfect for daily warm-ups and skill maintenance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <AdvancedScenarioSelector onScriptSelect={onScriptSelect} isConnected={isConnected} />
        </TabsContent>
      </Tabs>
    </div>
  );
}