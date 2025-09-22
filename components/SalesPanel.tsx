"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ConversationTemplates from "./ConversationTemplates";
import LeadQualification from "./LeadQualification";
import CRMIntegration from "./CRMIntegration";
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  TrendingUp, 
  Target,
  Clock,
  Star,
  MessageSquare,
  BarChart3,
  Settings
} from "lucide-react";

interface Lead {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  interest_level: number;
  qualification_score: number;
  notes: string[];
  created_at: Date;
}

interface SalesMetrics {
  totalCalls: number;
  qualifiedLeads: number;
  conversionRate: number;
  avgCallDuration: number;
}

export default function SalesPanel({
  currentLead,
  conversationMode,
  onModeChange,
  salesMetrics
}: {
  currentLead: Lead | null;
  conversationMode: 'discovery' | 'qualification' | 'demo' | 'closing';
  onModeChange: (mode: 'discovery' | 'qualification' | 'demo' | 'closing') => void;
  salesMetrics: SalesMetrics;
}) {
  const [selectedTab, setSelectedTab] = useState("lead");
  const [currentLeadState, setCurrentLeadState] = useState(currentLead);

  const handleQualificationUpdate = (score: number, criteria: any[]) => {
    if (currentLeadState) {
      setCurrentLeadState({
        ...currentLeadState,
        qualification_score: score
      });
    }
  };

  const handleTemplateUse = (text: string) => {
    // This would integrate with the voice system to suggest responses
    console.log("Template suggestion:", text);
  };

  const getInterestColor = (level: number) => {
    if (level >= 70) return "text-green-500";
    if (level >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getQualificationBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Hot Lead</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500">Warm Lead</Badge>;
    if (score >= 40) return <Badge className="bg-blue-500">Cold Lead</Badge>;
    return <Badge variant="outline">Unqualified</Badge>;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Sales Assistant</h2>
        <p className="text-sm text-muted-foreground">
          Real-time lead analysis & guidance
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-5 mx-4 mt-4">
          <TabsTrigger value="lead" className="text-xs">Lead</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs">Scripts</TabsTrigger>
          <TabsTrigger value="qualify" className="text-xs">Qualify</TabsTrigger>
          <TabsTrigger value="crm" className="text-xs">CRM</TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs">Metrics</TabsTrigger>
        </TabsList>

        {/* Lead Information Tab */}
        <TabsContent value="lead" className="flex-1 p-4 space-y-4 overflow-auto">
          {currentLead ? (
            <>
              {/* Lead Info Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Current Lead
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{currentLead.name || "Name pending..."}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span>{currentLead.company || "Company pending..."}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{currentLead.email || "Email pending..."}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{currentLead.phone || "Phone pending..."}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interest Level */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Interest Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Interest</span>
                      <span className={`text-sm font-medium ${getInterestColor(currentLead.interest_level)}`}>
                        {Math.round(currentLead.interest_level)}%
                      </span>
                    </div>
                    <Progress value={currentLead.interest_level} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Qualification Score */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Qualification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Score</span>
                      <span className="text-sm font-medium">
                        {Math.round(currentLead.qualification_score)}%
                      </span>
                    </div>
                    <Progress value={currentLead.qualification_score} className="h-2" />
                    <div className="flex justify-center">
                      {getQualificationBadge(currentLead.qualification_score)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conversation Mode */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Conversation Mode
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant={conversationMode === 'discovery' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onModeChange('discovery')}
                    >
                      Discovery
                    </Button>
                    <Button
                      variant={conversationMode === 'qualification' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onModeChange('qualification')}
                    >
                      Qualification
                    </Button>
                    <Button
                      variant={conversationMode === 'demo' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onModeChange('demo')}
                    >
                      Demo
                    </Button>
                    <Button
                      variant={conversationMode === 'closing' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onModeChange('closing')}
                    >
                      Closing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Start a conversation to begin lead analysis
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Conversation Templates Tab */}
        <TabsContent value="templates" className="flex-1 p-4 space-y-4 overflow-auto">
          <ConversationTemplates
            currentPhase={conversationMode}
            onPhaseChange={onModeChange}
            onUseTemplate={handleTemplateUse}
          />
        </TabsContent>

        {/* Lead Qualification Tab */}
        <TabsContent value="qualify" className="flex-1 p-4 space-y-4 overflow-auto">
          <LeadQualification onQualificationUpdate={handleQualificationUpdate} />
        </TabsContent>

        {/* CRM Integration Tab */}
        <TabsContent value="crm" className="flex-1 p-4 space-y-4 overflow-auto">
          <CRMIntegration />
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="flex-1 p-4 space-y-4 overflow-auto">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="w-4 h-4" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentLead ? (
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm">
                      <strong>Next Action:</strong> Based on current interest level ({Math.round(currentLead.interest_level)}%), 
                      recommend transitioning to {currentLead.interest_level > 60 ? 'demo phase' : 'qualification questions'}.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="text-sm">
                      <strong>Emotional Cue:</strong> Customer showing positive engagement signals. 
                      Good time to highlight key benefits.
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <p className="text-sm">
                      <strong>Objection Alert:</strong> Monitor for price sensitivity. 
                      Have ROI calculator ready.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  AI insights will appear during conversation
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Conversation Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-auto">
                {currentLead?.notes.length ? (
                  currentLead.notes.slice(-5).map((note, index) => (
                    <div key={index} className="text-xs p-2 bg-muted rounded">
                      {note}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Notes will appear as conversation progresses
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="flex-1 p-4 space-y-4 overflow-auto">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Sales Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{salesMetrics.totalCalls}</div>
                  <div className="text-xs text-muted-foreground">Total Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{salesMetrics.qualifiedLeads}</div>
                  <div className="text-xs text-muted-foreground">Qualified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{salesMetrics.conversionRate}%</div>
                  <div className="text-xs text-muted-foreground">Conv. Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{salesMetrics.avgCallDuration}m</div>
                  <div className="text-xs text-muted-foreground">Avg Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Today's Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Calls Target</span>
                  <span>{salesMetrics.totalCalls}/20</span>
                </div>
                <Progress value={(salesMetrics.totalCalls / 20) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Qualified Leads</span>
                  <span>{salesMetrics.qualifiedLeads}/5</span>
                </div>
                <Progress value={(salesMetrics.qualifiedLeads / 5) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}