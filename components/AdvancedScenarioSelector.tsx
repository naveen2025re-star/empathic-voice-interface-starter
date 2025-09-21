"use client";
import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { advancedSalesScenarios, buyerPersonas, type SalesScenario, type BuyerPersona } from "@/utils/salesCoaching";
import { Play, Users, Building2, Trophy, Clock, Target, TrendingUp, BookOpen, Filter } from "lucide-react";

interface AdvancedScenarioSelectorProps {
  onScriptSelect: (script: string, title: string, scenario?: SalesScenario) => void;
  isConnected: boolean;
}

const difficultyConfig = {
  beginner: { 
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", 
    icon: BookOpen,
    label: "Beginner"
  },
  intermediate: { 
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", 
    icon: TrendingUp,
    label: "Intermediate"
  },
  expert: { 
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", 
    icon: Trophy,
    label: "Expert"
  }
};

const industryConfig = {
  general: { label: "General", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
  saas: { label: "SaaS", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  healthcare: { label: "Healthcare", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  financial: { label: "Financial", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  realestate: { label: "Real Estate", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  enterprise: { label: "Enterprise", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" }
};

export default function AdvancedScenarioSelector({ onScriptSelect, isConnected }: AdvancedScenarioSelectorProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterIndustry, setFilterIndustry] = useState<string>("all");
  const [selectedPersona, setSelectedPersona] = useState<string>("all");

  // Filter scenarios based on current filters
  const filteredScenarios = useMemo(() => {
    return Object.entries(advancedSalesScenarios).filter(([key, scenario]) => {
      const difficultyMatch = filterDifficulty === "all" || scenario.difficulty === filterDifficulty;
      const industryMatch = filterIndustry === "all" || scenario.industry === filterIndustry;
      const personaMatch = selectedPersona === "all" || scenario.persona === selectedPersona;
      return difficultyMatch && industryMatch && personaMatch;
    });
  }, [filterDifficulty, filterIndustry, selectedPersona]);

  // Group scenarios by difficulty
  const scenariosByDifficulty = useMemo(() => {
    const grouped = filteredScenarios.reduce((acc, [key, scenario]) => {
      if (!acc[scenario.difficulty]) {
        acc[scenario.difficulty] = [];
      }
      acc[scenario.difficulty].push([key, scenario]);
      return acc;
    }, {} as Record<string, [string, SalesScenario][]>);
    return grouped;
  }, [filteredScenarios]);

  const handlePractice = (scenarioKey: string) => {
    const scenario = advancedSalesScenarios[scenarioKey];
    setSelectedScenario(scenarioKey);
    onScriptSelect(scenario.script, scenario.title, scenario);
  };

  if (isConnected) {
    return null;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Advanced Role-Playing Engine</h1>
        <p className="text-muted-foreground">Practice with different buyer personas, industries, and difficulty levels</p>
      </div>

      <Tabs defaultValue="scenarios" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scenarios">Practice Scenarios</TabsTrigger>
          <TabsTrigger value="personas">Buyer Personas</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="size-5" />
                Filter Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry</label>
                  <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="realestate">Real Estate</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Buyer Persona</label>
                  <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Personas</SelectItem>
                      {Object.entries(buyerPersonas).map(([key, persona]) => (
                        <SelectItem key={key} value={key}>{persona.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scenarios organized by difficulty */}
          {Object.entries(scenariosByDifficulty).map(([difficulty, scenarios]) => {
            const diffConfig = difficultyConfig[difficulty as keyof typeof difficultyConfig];
            const DifficultyIcon = diffConfig.icon;
            
            return (
              <div key={difficulty}>
                <div className="flex items-center gap-2 mb-4">
                  <DifficultyIcon className="size-5" />
                  <h2 className="text-xl font-semibold">{diffConfig.label} Level</h2>
                  <Badge className={diffConfig.color}>{scenarios.length} scenarios</Badge>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {scenarios.map(([key, scenario]) => {
                    const persona = buyerPersonas[scenario.persona];
                    const industryColor = industryConfig[scenario.industry as keyof typeof industryConfig]?.color || industryConfig.general.color;
                    const industryLabel = industryConfig[scenario.industry as keyof typeof industryConfig]?.label || "General";
                    
                    return (
                      <Card 
                        key={key} 
                        className={`cursor-pointer transition-all hover:shadow-lg ${selectedScenario === key ? 'ring-2 ring-primary' : ''}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={diffConfig.color}>{diffConfig.label}</Badge>
                            <div className="flex gap-1">
                              <Badge variant="outline" className={industryColor}>
                                {industryLabel}
                              </Badge>
                            </div>
                          </div>
                          
                          <CardTitle className="text-lg leading-tight">{scenario.title}</CardTitle>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="size-4" />
                            <span>{persona?.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="size-4" />
                            <span>{scenario.estimatedDuration}</span>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <CardDescription className="text-sm mb-4 line-clamp-3">
                            {scenario.script.length > 120 ? `${scenario.script.substring(0, 120)}...` : scenario.script}
                          </CardDescription>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">Objectives</div>
                              <div className="flex flex-wrap gap-1">
                                {scenario.objectives.slice(0, 2).map((objective, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {objective}
                                  </Badge>
                                ))}
                                {scenario.objectives.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{scenario.objectives.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <Button 
                              onClick={() => handlePractice(key)} 
                              className="w-full"
                              variant={selectedScenario === key ? "default" : "outline"}
                            >
                              <Play className="size-4 mr-2" />
                              Practice Scenario
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredScenarios.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="size-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No scenarios match your filters</h3>
                <p className="text-muted-foreground">Try adjusting your filters to see more practice scenarios.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="personas" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(buyerPersonas).map(([key, persona]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="size-5" />
                    {persona.name}
                  </CardTitle>
                  <CardDescription>{persona.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-medium text-sm mb-2">Personality Traits</div>
                    <div className="flex flex-wrap gap-1">
                      {persona.traits.map((trait, idx) => (
                        <Badge key={idx} variant="secondary">{trait}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-sm mb-2">Response Style</div>
                    <p className="text-sm text-muted-foreground">{persona.responseStyle}</p>
                  </div>
                  
                  <div>
                    <div className="font-medium text-sm mb-2">Common Objections</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {persona.objections.slice(0, 3).map((objection, idx) => (
                        <li key={idx}>• "{objection}"</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="font-medium text-sm mb-2">Sales Challenges</div>
                    <div className="flex flex-wrap gap-1">
                      {persona.challenges.map((challenge, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{challenge}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}