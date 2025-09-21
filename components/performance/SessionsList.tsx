"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { SessionData } from "@/utils/sessionStorage";

interface SessionsListProps {
  sessions: SessionData[];
  formatDate: (timestamp: number) => string;
  formatDuration: (duration: number) => string;
}

export function SessionsList({ sessions, formatDate, formatDuration }: SessionsListProps) {
  return (
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
                    {formatDate(session.createdAt?.getTime() || Date.now())}
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
  );
}