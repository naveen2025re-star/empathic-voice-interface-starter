"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Target, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSessionHistory, SessionData, exportSessionsAsJSON, exportSessionsAsCSV, getPerformanceTrend } from "@/utils/sessionStorage";
import { SalesMetrics } from "@/utils/salesCoaching";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamic imports for better code splitting
const PerformanceStats = dynamic(() => import("@/components/performance/PerformanceStats").then(mod => ({ default: mod.PerformanceStats })), {
  loading: () => <Card className="h-48 animate-pulse bg-muted" />
});

const SessionsList = dynamic(() => import("@/components/performance/SessionsList").then(mod => ({ default: mod.SessionsList })), {
  loading: () => <Card className="h-96 animate-pulse bg-muted" />
});

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
            {averageMetrics && <PerformanceStats averageMetrics={averageMetrics} />}

            {/* Recent Sessions */}
            <SessionsList 
              sessions={sessions} 
              formatDate={formatDate} 
              formatDuration={formatDuration} 
            />
          </div>
        )}
      </div>
    </div>
  );
}