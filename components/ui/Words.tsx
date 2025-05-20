"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/utils/supabase/client";
import { RocketIcon, ChromeIcon, PuzzleIcon, LinkIcon, Smartphone, CheckIcon, XIcon, Monitor, ChevronRightIcon, Loader2, ArrowRight, ArrowLeft, HelpCircle, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExtensionConnector } from "@/lib/extension";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

export default function Words() {
  type UserData = {
    name?: string; 
    [key: string]: unknown;
  };

  type Word = {
    id: string;
    word: string;
    part_of_speech: string;
    is_new?: boolean;
    definition: string;
    context: string;
    platform: string;
    show_name: string;
    season: number;
    episode: number;
  };

  type ExtensionMessage =
  | { type: 'AUTH_SUCCESS' }
  | { type: 'DATA_UPDATE'; words: string[] }
  | { type: string; [key: string]: unknown }; 

  const [userData, setUserData] = useState<UserData>({});
  const [userWords, setUserWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [modalOpen, setModalOpen] = useState(false);
  const [installGuide, setInstallGuide] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showWalkthrough, setWalkthrough] = useState(false);
  const [HasCompletedWalkThrough, setHasCompletedWalkThrough] = useState(false)
  const [extensionAvailable, setExtensionAvailable] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const guide = [
    {
      id: 1,
      title: "Install the Extension",
      description: "Add Scribe to your browser to start collecting words",
      icon: <ChromeIcon className="h-6 w-6"/>
    },
    {
      id: 2,
      title: "Pin the extension",
      description: "Make it easily accessible in your toolbar",
      icon: <PuzzleIcon className="h-6 w-6"/>
    },
    {
      id: 3,
      title: "Connect to App",
      description: "Link your extension with this web app",
      icon: <LinkIcon className="h-6 w-6"/>
    },
  ];

  const tourSteps = [
    {
      title: "Welcome to Your Dashboard",
      content: "This is where you'll track your language learning progress.",
      target: null,
    },
    {
      title: "Progress Stats",
      content: "Track your words learned, streak, retention, and study time.",
      target: "stats-section",
    },
    {
      title: "Your Word Collection",
      content: "All words you save will appear here for review.",
      target: "words-section",
    },
    {
      title: "Get Started",
      content: "Install our extension to start collecting words from videos.",
      target: "install-button",
    }
  ];

  useEffect(() => {
    const messageHandler = (message: ExtensionMessage) => {
      if (message.type === 'EXTENSION_DISCONNECTED') {
        setConnected(false);
        console.log({
          title: "Disconnected",
          description: "Your extension has been disconnected",
          variant: "default",
        });
      }
    };

    ExtensionConnector.listenForMessages(messageHandler);
    
    return () => {
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data.type === 'EXTENSION_DISCONNECTED') {
        setConnected(false);
        console.log({
          title: "Disconnected",
          description: "Your extension has been disconnected",
          variant: "default",
        });
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    const checkExtension = async () => {
      const isAvailable = await ExtensionConnector.isExtensionInstalled();
      setExtensionAvailable(isAvailable);
      
      if (isAvailable) {
        ExtensionConnector.listenForMessages((data) => {
          console.log('Received data from extension:', data);
          handleExtensionMessage(data);
        });
      }
    };

    if (typeof window !== 'undefined') {
      checkExtension();
    }
  }, []);

  const handleExtensionMessage = (data: ExtensionMessage) => {
    switch (data.type) {
      case 'AUTH_SUCCESS':
        setConnected(true);
        setModalOpen(false);
        console.log({
          title: "Extension Connected",
          description: "Your extension is now linked to the web app.",
        });
        break;

      case 'DATA_UPDATE':
        if ('words' in data && Array.isArray(data.words)) {
          const newWords: Word[] = data.words.map(str => ({
            id: crypto.randomUUID?.() || Math.random().toString(36).substring(2),
            word: str,
            part_of_speech: 'noun',
            definition: 'Definition not available',
            context: '',
            platform: 'unknown',
            show_name: 'Unknown Show',
            season: 1,
            episode: 1,
            is_new: true
          }));

          setUserWords(prev => [...newWords, ...prev]);

          console.log({
            title: "New Words Added",
            description: `${newWords.length} new words collected from your extension.`,
          });
        }
        break;

      default:
        console.log('Unhandled message type:', data.type);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setConnectionError(false);
      const isConnected = await ExtensionConnector.connect();
      
      if (isConnected) {
        setConnected(true);
        setConnectionError(false);
        console.log({
          title: "Extension Connected",
          description: "Your extension is now linked to the web app.",
        });
      } else {
        setConnected(false);
        setConnectionError(true);
        console.log({
          title: "Connection Failed",
          description: "Please authenticate in the extension.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      setConnected(false);
      setConnectionError(true);
      console.log({
        title: "Connection Error",
        description: "Failed to communicate with extension.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const has_completed_tour = user?.user_metadata?.has_completed_tour;
      setUserData(user?.user_metadata || {});

      if (has_completed_tour == undefined) {
        setTimeout(() => setWalkthrough(true), 1500);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const getWords = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('learned_words')
          .select('id, word, part_of_speech, definition, context, show_name, season, episode, platform, is_new')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching learned words:', error.message);
        } else {
          setUserWords(data || []);
        }
      } else {
        console.log('User not authenticated');
      }
      setLoading(false);
    };

    getWords();
  }, []);

  const completeTour = async () => {
    setWalkthrough(false);
    setHasCompletedWalkThrough(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          ...user.user_metadata,
          has_completed_tour: true 
        }
      });

      console.log(HasCompletedWalkThrough);

      if (updateError) {
        console.error('Error updating user metadata:', updateError.message);
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      const success = await ExtensionConnector.disconnect();
      if (success) {
        setConnected(false);
        console.log({
          title: "Extension Disconnected",
          description: "Your extension is no longer linked to the web app.",
        });
      } else {
        console.log({
          title: "Disconnection Failed",
          description: "Could not disconnect from the extension.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Disconnection error:', error);
      console.log({
        title: "Disconnection Error",
        description: "Failed to disconnect from extension.",
        variant: "destructive",
      });
    }
  };

  const handleNextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevTourStep = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const handleInstallClick = () => {
    if (showWalkthrough) completeTour();
    setModalOpen(true);
    if (!isMobile) {
      setInstallGuide(1);
      setConnected(false);
    }
  };

  const step2 = () => {
    setInstallGuide(2);
    setTimeout(() => setInstallGuide(3), 2000);
  }

  const step3 = async () => {
    setIsConnecting(true);
    try {
      await handleConnect();
    } finally {
      setIsConnecting(false);
    }
  }

  const getTourClasses = (targetName: string) => {
    return showWalkthrough && tourSteps[tourStep].target === targetName 
      ? "ring-2 ring-primary ring-offset-2 rounded-lg transition-all duration-300"
      : "";
  };

  return (
    <div className="flex h-full flex-col p-6 relative">
      {!showWalkthrough && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4"
          onClick={() => {
            setWalkthrough(true);
            setTourStep(0);
          }}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      )}

      {showWalkthrough && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg max-w-md mx-4 relative z-50">
            <h3 className="text-xl font-bold mb-2">{tourSteps[tourStep].title}</h3>
            <p className="text-muted-foreground mb-6">{tourSteps[tourStep].content}</p>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevTourStep}
                disabled={tourStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <Button onClick={handleNextTourStep}>
                {tourStep === tourSteps.length - 1 ? "Finish Tour" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 flex justify-center gap-1">
              {tourSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 w-2 rounded-full ${index === tourStep ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div 
        className={`mb-6 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${getTourClasses("install-button")}`}
        id="install-button"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            Welcome back, {userData.name}
          </h1>
          <p className="text-muted-foreground mt-1 sm:mt-0">
            Continue your learning journey
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={handleInstallClick}
          className="w-full sm:w-auto"
        >
          <ChromeIcon className="mr-2 h-4 w-4" />
          {extensionAvailable ? 'Manage Extension' : 'Install Extension'}
        </Button>
      </div>

      <div 
        className={`mb-8 grid gap-4 md:grid-cols-z2 lg:grid-cols-4 ${getTourClasses("stats-section")}`}
        id="stats-section"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Words Learned</CardDescription>
            <CardTitle className="text-2xl">{userWords.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+{userWords.filter(w => w.is_new).length} this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-2xl">0 days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Keep going!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Retention Rate</CardDescription>
            <CardTitle className="text-2xl">0%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Time Studied</CardDescription>
            <CardTitle className="text-2xl">0h 0m</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>
      <div className={`flex-1 ${getTourClasses("words-section")}`} id="words-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Your Word Collection</h2>
          {connected && (
            <div className="flex items-center gap-2">
              <div className="flex items-center text-sm text-green-500">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                Extension Connected
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDisconnect}
                className="h-8"
              >
                <LinkIcon className="h-3 w-3 mr-1" />
                Disconnect
              </Button>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-pulse text-center">
              <p className="text-lg text-muted-foreground">Loading your words...</p>
            </div>
          </div>
        ) : userWords.length > 0 ? (
          <div className="space-y-3">
            {connected && (
              <Card className="border-green-500/20 bg-green-500/5">
                <CardContent className="p-4 flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Extension Active</p>
                    <p className="text-xs text-muted-foreground">
                      Words will automatically sync from your shows
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8">
                    <RocketIcon className="h-3 w-3 mr-1" />
                    View Tutorial
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {userWords.map((word) => (
                <Card key={word.id} className="hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-2 space-y-1">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{word.word}</CardTitle>
                      {word.is_new && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {word.definition}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <p className="text-sm text-muted-foreground italic line-clamp-2">
                      &quot;{word.context}&quot;
                    </p>
                    <div className="mt-2 flex items-center text-xs text-muted-foreground">
                      <span className="truncate">
                        {word.show_name} • S{word.season}E{word.episode}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-3 py-2">
                    <div className="w-full flex justify-between items-center">
                      <Badge variant="outline" className="text-xs capitalize">
                        {word.part_of_speech}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                          </svg>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : connected || extensionAvailable ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping"></div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                <ChromeIcon className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <h3 className="mt-6 text-xl font-semibold">Ready to Collect Words</h3>
            <p className="mb-6 mt-2 text-sm text-muted-foreground max-w-md">
              Your extension is connected! Start watching shows and words will automatically appear here.
            </p>
            <div className="flex gap-3">
              <Button>
                <RocketIcon className="mr-2 h-4 w-4" />
                How It Works
              </Button>
              <Button variant="outline">
                <Monitor className="mr-2 h-4 w-4" />
                Supported Platforms
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <PuzzleIcon className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">Start Collecting Words</h3>
            <p className="mb-6 mt-2 text-sm text-muted-foreground max-w-md">
              Use our browser extension to easily save words while watching shows. 
              The words you collect will appear here for review and practice.
            </p>
            <div className="flex gap-4">
              <Button onClick={handleInstallClick}>
                <ChromeIcon className="mr-2 h-4 w-4" />
                Get the Extension
              </Button>
              <Button variant="outline">
                <RocketIcon className="mr-2 h-4 w-4" />
                How It Works
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isMobile ? (
                <div className="flex items-center gap-2">
                  <Smartphone className="h-6 w-6"/>
                  <span>Desktop Required</span>
                </div>
              ) : connectionError ? (
                <div className="flex items-center gap-2 text-red-600">
                  <XIcon className="w-6 h-6"/>
                  <span>Connection Failed</span>
                </div>
              ) : installGuide === 3 && connected ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckIcon className="w-6 h-6"/>
                  <span>Connected Successfully!</span>
                </div>
              ) : (
                "Get Started with Scribe's Extension"
              )}
            </DialogTitle>
            <DialogDescription>
              {isMobile
                ? "The Scribe extension is only available on desktop browsers."
                : connectionError
                ? "Couldn't connect to the extension. Please make sure it's installed and try again."
                : installGuide === 3 && connected
                ? "Your extension is now connected to the web app. Start collecting words!"
                : "Follow these simple steps to start learning from your favorite shows"
              }
            </DialogDescription>
        </DialogHeader>

           {!isMobile && (
            <div className="py-4">
              <Progress 
                value={(installGuide/3)*100} 
                className={`h-2 mb-6 ${connectionError ? "bg-red-500" : ""}`}
              />

              <div className="space-y-6">
                {guide.map((step) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: installGuide >= step.id ? 1 : 0.5,
                      y: 0,
                      scale: installGuide === step.id ? 1.02 : 1
                    }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-4 p-4 rounded-lg ${
                      installGuide === step.id ? 
                        connectionError ? "bg-red-500/10" : "bg-accent" 
                        : ""
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      connectionError && installGuide >= step.id ? "bg-red-500 text-white" :
                      installGuide >= step.id ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {connectionError && installGuide === 3 && (
                        <p className="text-xs text-red-500 mt-1">
                          Connection failed. Check the extension and try again.
                        </p>
                      )}
                    </div>
                    {installGuide > step.id ? (
                      <div className={connectionError ? "text-red-500" : "text-green-500"}>
                        {connectionError && installGuide === 3 ? (
                          <XIcon className="h-5 w-5 mt-1" />
                        ) : (
                          <CheckIcon className="h-5 w-5 mt-1" />
                        )}
                      </div>
                    ) : installGuide === step.id ? (
                      <ChevronRightIcon className="h-5 w-5 mt-1" />
                    ) : null}
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                {installGuide === 1 ? (
                  <Button variant={"outline"} onClick={() => {
                    setModalOpen(false);
                    setConnectionError(false);
                  }}>
                    Cancel
                  </Button>
                ) : (
                  <Button variant={"outline"} onClick={() => {
                    setInstallGuide(installGuide-1);
                    setConnectionError(false);
                  }}>
                    Back
                  </Button>
                )}

                {installGuide < 3 ? (
                  <Button onClick={step2}>
                    {installGuide == 1 ? "Install Extension" : "Next Step"}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    {connected && (
                      <Button 
                        variant="outline"
                        onClick={handleDisconnect}
                        disabled={isConnecting}
                      >
                        <XIcon className="mr-2 h-4 w-4" />
                        Disconnect
                      </Button>
                    )}
                    <Button 
                      onClick={step3} 
                      disabled={isConnecting}
                      className="flex-1"
                      variant={connectionError ? "destructive" : "default"}
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                          {connectionError ? "Retrying..." : "Connecting..."}
                        </>
                      ) : connectionError ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4"/>
                          Retry Connection
                        </>
                      ) : connected ? (
                        <>
                          <CheckIcon className="mr-2 h-4 w-4"/>
                          Connected
                        </>
                      ) : (
                        "Connect to App"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
        </Dialog>
    </div>
  );
}