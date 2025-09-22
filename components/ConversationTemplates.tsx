"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  MessageSquare, 
  Copy, 
  Play, 
  Lightbulb,
  Target,
  Presentation,
  Handshake
} from "lucide-react";
import { SALES_TEMPLATES, getTemplatesByPhase, getRandomQuestion, getRandomObjectionHandler } from "./SalesTemplates";
import { toast } from "sonner";

interface ConversationTemplatesProps {
  currentPhase: 'discovery' | 'qualification' | 'demo' | 'closing';
  onPhaseChange: (phase: 'discovery' | 'qualification' | 'demo' | 'closing') => void;
  onUseTemplate: (text: string) => void;
}

export default function ConversationTemplates({ 
  currentPhase, 
  onPhaseChange, 
  onUseTemplate 
}: ConversationTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const phases = [
    { id: 'discovery', name: 'Discovery', icon: Target, color: 'bg-blue-500' },
    { id: 'qualification', name: 'Qualification', icon: MessageSquare, color: 'bg-green-500' },
    { id: 'demo', name: 'Demo', icon: Presentation, color: 'bg-purple-500' },
    { id: 'closing', name: 'Closing', icon: Handshake, color: 'bg-orange-500' }
  ] as const;

  const currentTemplates = getTemplatesByPhase(currentPhase);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleUseTemplate = (text: string) => {
    onUseTemplate(text);
    toast.success("Template suggested to AI agent!");
  };

  const getRandomSuggestion = () => {
    if (!selectedTemplate) return;
    
    const template = SALES_TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template) return;

    const suggestions = [
      getRandomQuestion(template),
      getRandomObjectionHandler(template),
      template.prompts.opening,
      template.prompts.closing
    ];

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    handleUseTemplate(randomSuggestion);
  };

  return (
    <div className="space-y-4">
      {/* Phase Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Conversation Phase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {phases.map((phase) => {
              const Icon = phase.icon;
              return (
                <Button
                  key={phase.id}
                  variant={currentPhase === phase.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPhaseChange(phase.id as any)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-3 h-3" />
                  {phase.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTemplate || ''} onValueChange={setSelectedTemplate}>
            <TabsList className="grid w-full grid-cols-1 gap-1 h-auto">
              {currentTemplates.map((template) => (
                <TabsTrigger 
                  key={template.id} 
                  value={template.id}
                  className="text-xs"
                >
                  {template.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {currentTemplates.map((template) => (
              <TabsContent key={template.id} value={template.id} className="mt-3">
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {template.description}
                  </p>

                  {/* Opening */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium">Opening</h4>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleCopyText(template.prompts.opening)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleUseTemplate(template.prompts.opening)}
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-2 bg-muted rounded text-xs">
                      {template.prompts.opening}
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium">Key Questions</h4>
                    <div className="space-y-1">
                      {template.prompts.questions.slice(0, 3).map((question, index) => (
                        <div key={index} className="flex items-start justify-between">
                          <p className="text-xs text-muted-foreground flex-1 pr-2">
                            • {question}
                          </p>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0"
                              onClick={() => handleCopyText(question)}
                            >
                              <Copy className="w-2 h-2" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 w-5 p-0"
                              onClick={() => handleUseTemplate(question)}
                            >
                              <Play className="w-2 h-2" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={getRandomSuggestion}
                    >
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Random Tip
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}