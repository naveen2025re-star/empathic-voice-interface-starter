"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Shield, Eye, EyeOff, Trash2, Lock, Server, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PrivacyModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isVisible, onClose }: PrivacyModalProps) {
  const [dataStorageConsent, setDataStorageConsent] = useState(true);
  const [showStoredData, setShowStoredData] = useState(false);
  const [storedDataInfo, setStoredDataInfo] = useState({
    moodEntries: 0,
    lastUpdated: null as Date | null
  });

  useEffect(() => {
    // Check for stored data
    const moodData = localStorage.getItem('mindspace-mood-history');
    const consent = localStorage.getItem('mindspace-data-consent');
    
    if (moodData) {
      try {
        const parsed = JSON.parse(moodData);
        setStoredDataInfo({
          moodEntries: parsed.length,
          lastUpdated: parsed.length > 0 ? new Date(parsed[0].timestamp) : null
        });
      } catch (error) {
        setStoredDataInfo({ moodEntries: 0, lastUpdated: null });
      }
    }

    if (consent !== null) {
      setDataStorageConsent(consent === 'true');
    }
  }, [isVisible]);

  const handleConsentChange = (newConsent: boolean) => {
    setDataStorageConsent(newConsent);
    localStorage.setItem('mindspace-data-consent', newConsent.toString());
    
    if (!newConsent) {
      // Clear all stored data if consent is revoked
      localStorage.removeItem('mindspace-mood-history');
      setStoredDataInfo({ moodEntries: 0, lastUpdated: null });
    }
  };

  const clearAllData = () => {
    if (confirm("Are you sure you want to permanently delete all your data? This includes mood history and preferences. This action cannot be undone.")) {
      localStorage.removeItem('mindspace-mood-history');
      localStorage.removeItem('mindspace-data-consent');
      setStoredDataInfo({ moodEntries: 0, lastUpdated: null });
      setDataStorageConsent(true); // Reset to default
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <Card className="therapeutic-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="size-5 text-primary" />
                    Privacy & Safety
                  </CardTitle>
                  <CardDescription>
                    Your data privacy and safety controls
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Privacy Overview */}
              <div className="space-y-4">
                <h3 className="font-medium">How We Protect Your Privacy</h3>
                <div className="grid gap-4">
                  <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                    <Lock className="size-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">On-Device Storage</h4>
                      <p className="text-sm text-muted-foreground">Your mood data is stored locally on your device only. We never send your personal information to our servers.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                    <Server className="size-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Secure Connections</h4>
                      <p className="text-sm text-muted-foreground">Voice conversations use TLS encryption. Audio is processed for emotional understanding but not stored or recorded.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                    <CheckCircle className="size-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">HIPAA-Grade Standards</h4>
                      <p className="text-sm text-muted-foreground">We follow healthcare-level privacy standards to protect your sensitive emotional and mental health data.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Storage Consent */}
              <div className="space-y-4">
                <h3 className="font-medium">Data Storage Preferences</h3>
                <div className="therapeutic-accent p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">Store mood tracking data locally</h4>
                      <p className="text-xs text-muted-foreground">Keep your mood history on this device for insights and trends</p>
                    </div>
                    <Button
                      variant={dataStorageConsent ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleConsentChange(!dataStorageConsent)}
                    >
                      {dataStorageConsent ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stored Data Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Your Stored Data</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStoredData(!showStoredData)}
                    className="flex items-center gap-2"
                  >
                    {showStoredData ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    {showStoredData ? "Hide" : "Show"} Details
                  </Button>
                </div>
                
                {showStoredData && (
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">Mood Entries</h4>
                          <p className="text-xs text-muted-foreground">
                            {storedDataInfo.moodEntries} entries stored
                            {storedDataInfo.lastUpdated && (
                              <span className="block">Last updated: {storedDataInfo.lastUpdated.toLocaleDateString()}</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          {storedDataInfo.moodEntries > 0 ? (
                            <span className="text-primary">Active</span>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Data Management */}
              <div className="space-y-4">
                <h3 className="font-medium">Data Management</h3>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="destructive"
                    onClick={clearAllData}
                    className="flex items-center gap-2 justify-center"
                    disabled={storedDataInfo.moodEntries === 0}
                  >
                    <Trash2 className="size-4" />
                    Delete All Data
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    This will permanently remove all mood history and preferences from this device.
                  </p>
                </div>
              </div>

              {/* Safety Resources */}
              <div className="therapeutic-accent p-4">
                <h3 className="font-medium text-sm mb-3">Crisis Support Resources</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>National Suicide Prevention Lifeline:</strong> 988</div>
                  <div><strong>Crisis Text Line:</strong> Text HOME to 741741</div>
                  <div><strong>National Domestic Violence Hotline:</strong> 1-800-799-7233</div>
                  <p className="text-xs text-muted-foreground mt-3">
                    If you're experiencing a mental health emergency, please contact emergency services or go to your nearest emergency room.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}