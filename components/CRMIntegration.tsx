"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { 
  Database, 
  Users, 
  ExternalLink, 
  Settings,
  Check,
  X,
  AlertCircle
} from "lucide-react";

interface CRMConnection {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  icon: string;
  features: string[];
  status: 'active' | 'error' | 'disconnected';
}

export default function CRMIntegration() {
  const [connections, setConnections] = useState<CRMConnection[]>([
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Sync leads and conversations to HubSpot CRM',
      connected: false,
      icon: '🔶',
      features: ['Lead sync', 'Contact creation', 'Deal tracking', 'Activity logging'],
      status: 'disconnected'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Connect with Salesforce Sales Cloud',
      connected: false,
      icon: '☁️',
      features: ['Lead management', 'Opportunity tracking', 'Custom fields', 'Reports'],
      status: 'disconnected'
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      description: 'Integrate with Pipedrive pipeline management',
      connected: false,
      icon: '🚀',
      features: ['Pipeline sync', 'Contact management', 'Deal stages', 'Notes sync'],
      status: 'disconnected'
    },
    {
      id: 'airtable',
      name: 'Airtable',
      description: 'Store leads and data in Airtable',
      connected: true,
      icon: '📊',
      features: ['Custom fields', 'Team collaboration', 'Flexible views', 'Automations'],
      status: 'active'
    }
  ]);

  const toggleConnection = (id: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id 
        ? { ...conn, connected: !conn.connected, status: !conn.connected ? 'active' : 'disconnected' }
        : conn
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Check className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <X className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500">Connected</Badge>;
      case 'error': return <Badge className="bg-red-500">Error</Badge>;
      default: return <Badge variant="outline">Disconnected</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="w-5 h-5" />
            CRM Integrations
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Connect your favorite CRM to automatically sync leads and conversations
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {connections.map((connection) => (
            <div key={connection.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{connection.icon}</span>
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      {connection.name}
                      {getStatusIcon(connection.status)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {connection.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(connection.status)}
                  <Switch
                    checked={connection.connected}
                    onCheckedChange={() => toggleConnection(connection.id)}
                  />
                </div>
              </div>

              {connection.connected && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Available Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {connection.features.map((feature, index) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View in {connection.name}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Sync Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Auto-sync new leads</p>
              <p className="text-xs text-muted-foreground">
                Automatically create contacts for new conversations
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Sync conversation notes</p>
              <p className="text-xs text-muted-foreground">
                Add conversation summaries to contact records
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Real-time updates</p>
              <p className="text-xs text-muted-foreground">
                Update lead scores and status in real-time
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Emotion insights</p>
              <p className="text-xs text-muted-foreground">
                Include emotional analysis in contact notes
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}