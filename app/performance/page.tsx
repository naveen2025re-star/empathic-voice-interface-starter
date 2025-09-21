"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Target, Calendar, Clock, Award, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSessionHistory, SessionData, exportSessionsAsJSON, exportSessionsAsCSV, getPerformanceTrend } from "@/utils/sessionStorage";
import { calculateSalesMetrics, SalesMetrics } from "@/utils/salesCoaching";
import { toast } from "sonner";

export default function PerformancePage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [averageMetrics, setAverageMetrics] = useState<SalesMetrics | null>(null);

  useEffect(() => {
    const sessionHistory = getSessionHistory();
    setSessions(sessionHistory);
    
    if (sessionHistory.length > 0) {
      // Calculate average metrics across all sessions
      const totalMetrics = sessionHistory.reduce((acc, session) => {
        return {
          confidence: acc.confidence + session.averageMetrics.confidence,
          enthusiasm: acc.enthusiasm + session.averageMetrics.enthusiasm,
          persuasiveness: acc.persuasiveness + session.averageMetrics.persuasiveness,
          authenticity: acc.authenticity + session.averageMetrics.authenticity,
          nervousness: acc.nervousness + session.averageMetrics.nervousness,
          overall_score: acc.overall_score + session.averageMetrics.overall_score
        };
      }, { confidence: 0, enthusiasm: 0, persuasiveness: 0, authenticity: 0, nervousness: 0, overall_score: 0 });

      setAverageMetrics({
        confidence: totalMetrics.confidence / sessionHistory.length,
        enthusiasm: totalMetrics.enthusiasm / sessionHistory.length,
        persuasiveness: totalMetrics.persuasiveness / sessionHistory.length,
        authenticity: totalMetrics.authenticity / sessionHistory.length,
        nervousness: totalMetrics.nervousness / sessionHistory.length,
        overall_score: totalMetrics.overall_score / sessionHistory.length
      });
    }
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExportJSON = () => {
    const jsonData = exportSessionsAsJSON();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonData);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `emoticlose-sessions-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Session data exported as JSON!");
  };

  const handleExportCSV = () => {
    const csvData = exportSessionsAsCSV();
    if (!csvData) {
      toast.error("No sessions to export");
      return;
    }
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvData);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `emoticlose-sessions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Session data exported as CSV!");
  };

  // Performance trends for visualization
  const confidenceTrend = getPerformanceTrend('confidence', 7);
  const overallTrend = getPerformanceTrend('overall_score', 7);
  
  const renderMiniChart = (values: number[], color: string = 'bg-primary') => {
    if (values.length === 0) return null;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end gap-px h-8 w-16">
        {values.map((value, i) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={i}
              className={`${color} opacity-70 transition-all duration-200`}
              style={{ height: `${Math.max(height, 10)}%`, width: '3px' }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="size-4" />
              Back to Practice
            </Button>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-6 text-primary" />
              <h1 className="text-2xl font-bold">Performance Dashboard</h1>
            </div>
          </div>
          
          {sessions.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="size-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportJSON}>
                <Download className="size-4 mr-2" />
                Export JSON
              </Button>
            </div>
          )}
        </div>

        {sessions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="size-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Practice Sessions Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start practicing with AI coaching to see your performance analytics here.
              </p>
              <Button onClick={() => router.push("/")}>
                Start First Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessions.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {averageMetrics ? Math.round(averageMetrics.overall_score) : 0}%
                    </div>
                    {overallTrend.length > 1 && renderMiniChart(overallTrend)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Practice Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatDuration(sessions.reduce((acc, s) => acc + s.duration, 0))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Best Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sessions.length > 0 ? Math.round(Math.max(...sessions.map(s => s.averageMetrics.overall_score))) : 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Average Performance Metrics */}
            {averageMetrics && (
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
            )}

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5" />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.slice(0, 10).map((session) => (
                    <div key={session.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="size-4" />
                            {formatDate(session.timestamp)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="size-4" />
                            {formatDuration(session.duration)}
                          </div>
                          <div className="text-sm font-medium">
                            {session.scriptTitle}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Score: </span>
                            <span className="font-semibold">
                              {Math.round(session.averageMetrics.overall_score)}%
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary opacity-70" 
                                 style={{ opacity: session.averageMetrics.confidence / 100 }} />
                            <div className="w-2 h-2 rounded-full bg-green-500 opacity-70" 
                                 style={{ opacity: session.averageMetrics.enthusiasm / 100 }} />
                            <div className="w-2 h-2 rounded-full bg-blue-500 opacity-70" 
                                 style={{ opacity: session.averageMetrics.persuasiveness / 100 }} />
                            <div className="w-2 h-2 rounded-full bg-purple-500 opacity-70" 
                                 style={{ opacity: session.averageMetrics.authenticity / 100 }} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Conversation Insights */}
                      {session.conversationSummary && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          {session.conversationSummary.strengths.length > 0 && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                              <div className="font-medium text-green-700 dark:text-green-400 mb-1">✓ Strengths</div>
                              <div className="text-green-600 dark:text-green-300">
                                {session.conversationSummary.strengths[0]}
                              </div>
                            </div>
                          )}
                          {session.conversationSummary.improvements.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                              <div className="font-medium text-blue-700 dark:text-blue-400 mb-1">💡 Improvements</div>
                              <div className="text-blue-600 dark:text-blue-300">
                                {session.conversationSummary.improvements[0]}
                              </div>
                            </div>
                          )}
                          {session.conversationSummary.keyPoints.length > 0 && (
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                              <div className="font-medium text-purple-700 dark:text-purple-400 mb-1">📝 Key Points</div>
                              <div className="text-purple-600 dark:text-purple-300">
                                {session.conversationSummary.keyPoints[0]}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}