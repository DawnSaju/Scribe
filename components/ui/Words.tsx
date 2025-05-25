"use client";

import React, { useState, useEffect, Fragment } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/utils/supabase/client";
import { RocketIcon, ChromeIcon, PuzzleIcon, LinkIcon, Smartphone, CheckIcon, Play, XIcon, Monitor, Loader2, ArrowRight, ArrowLeft, HelpCircle, RefreshCw, SettingsIcon, PowerIcon, Bookmark, MessageSquare, Tv2, CalendarDays, Trash2, MoreHorizontal, Plus, TrendingUp, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ExtensionConnector } from "@/lib/extension";
import { RiGithubFill, RiNetflixFill, RiYoutubeFill } from "@remixicon/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    example: string;
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
  const [modalType, setModalType] = useState<'install' | 'manage'>('install');
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [openPlatforms, setOpenPlatforms] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentStep, setcurrentStep] = useState(1);
  const [extensionId, setExtensionId] = useState('');

  const guide = [
    {
      id: 1,
      title: "Clone the Repository",
      description: "Visit GitHub and clone the extension source code",
      icon: <RiGithubFill className="h-6 w-6" />,
      content: (
        <div className="mt-3 bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
          <p>git clone https://github.com/DawnSaju/Scribe-Extension.git</p>
        </div>
      )
    },
    {
      id: 2,
      title: "Load Unpacked Extension",
      description: "Install the extension in developer mode",
      icon: <ChromeIcon className="h-6 w-6" />,
      content: (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">1.</span>
            <span>Open Chrome and go to <span className="font-mono">chrome://extensions</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">2.</span>
            <span>Enable <span className="font-semibold">Developer mode</span> (toggle in top right)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">3.</span>
            <span>Click <span className="font-semibold">Load unpacked</span> and select the cloned folder</span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Pin & Connect",
      description: "Make it accessible and link to this app",
      icon: <LinkIcon className="h-6 w-6" />,
      content: (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">1.</span>
            <span>Pin the extension to your toolbar (click the puzzle icon in Chrome)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">2.</span>
            <span>Click the extension icon and select <span className="font-semibold">Connect</span></span>
          </div>
        </div>
      )
    }
  ];

  const walkthroughSteps = [
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
    },
    {
      title: "Connect Your Extension",
      content: "Enter your extension ID to continue",
      target: "extension-id-input",
    }
  ];

  const handleCopy = (text: string) => {
    void copied;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const checkInstallProgress = async () => {
      void currentStep;
      const { data: { user } } = await supabase.auth.getUser();
      const installProgress = user?.user_metadata?.install_progress;
      
      if (installProgress) {
        setcurrentStep(installProgress);
        setInstallGuide(installProgress);
        
        if (installProgress >= 3) {
          setConnected(true);
        }
      }
    };

    checkInstallProgress();
  }, []);

  const handleNextStep = async (nextStep: number) => {
    setInstallGuide(nextStep);
    setcurrentStep(nextStep);
    
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.auth.updateUser({
      data: { 
        ...user?.user_metadata,
        install_progress: nextStep 
      }
    });
  };

  const handleReset = async () => {
    setInstallGuide(1);
    setcurrentStep(1);
    handleDisconnect();
    setConnected(false);
    setConnectionError(false);
    
    await supabase.auth.updateUser({
      data: { 
        ...userData,
        install_progress: 1 
      }
    });
  };

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
    if (!extensionId || extensionId.trim() === '') {
      setConnected(false);
      setExtensionAvailable(false);
      return;
    }
    let cancelled = false;
    const check = async () => {
      const isAvailable = await ExtensionConnector.isExtensionInstalled();
      if (cancelled) return;
      setExtensionAvailable(isAvailable);
      if (isAvailable) {
        const isConnected = await ExtensionConnector.connect();
        if (cancelled) return;
        setConnected(isConnected);
      } else {
        setConnected(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [extensionId]);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setConnectionError(false);
      const isConnected = await ExtensionConnector.connect();
      
      if (isConnected) {
        setConnected(true);
        setModalType("manage");
        setExtensionAvailable(true)
        setConnectionError(false);
        console.log({
          title: "Extension Connected",
          description: "Your extension is now linked to the web app.",
        });
      } else {
        setConnected(false);
        setModalType("install");
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
      setModalType("install");
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

  async function getShowPoster(showName: string, season: number, episode: number) {
    const res = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(showName)}&apikey=7c57638d`
    );
    const data = await res.json();
    console.log("DATA FROM THE POSTER API", data)

    if (data.Response === "True" && data.Poster && data.Poster !== "N/A") {
      setPosterUrl(data.Poster); 
    } else {
      setPosterUrl(null);
    }
  }

  const getTourClasses = (targetName: string) => {
    return showWalkthrough && walkthroughSteps[tourStep].target === targetName 
      ? "ring-2 ring-primary ring-offset-2 rounded-lg transition-all duration-300"
      : "";
  };

  useEffect(() => {
    const unsubscribe = ExtensionConnector.listenForWordMessages((word) => {
      console.log('[page.tsx] Got word from extension:', word);
      setUserWords(prev => [...prev, word]);
      getShowPoster(word.show_name, word.season, word.episode);
      console.log(posterUrl)
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
          .select('id, word, part_of_speech, definition, example, show_name, season, episode, platform, is_new')
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

  useEffect(() => {
    const loadExtensionId = async () => {
      let storedId = typeof window !== 'undefined' ? localStorage.getItem('extensionId') : null;
      if (storedId && storedId.trim() !== '') {
        setExtensionId(storedId);
        ExtensionConnector.setExtensionId(storedId);
        handleConnect();
        return;
      }
    };
    loadExtensionId();
  }, []);

  const completeTour = async () => {
    setWalkthrough(false);
    setHasCompletedWalkThrough(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          ...user.user_metadata,
          has_completed_tour: true,
        }
      });

      console.log(HasCompletedWalkThrough);

      if (updateError) {
        console.error('Error updating user metadata:', updateError.message);
      }
    }
  };

  const handleRemoveExtension = async () => {
    try {
      await ExtensionConnector.disconnect();
      setConnected(false);
      setModalOpen(false);
      setExtensionAvailable(false);
      console.log({
        title: "Extension Removed",
        description: "The extension has been permanently disconnected",
        variant: "default",
      });
      localStorage.removeItem("extensionId")
    } catch (error) {
      console.log({
        title: "Removal Failed",
        description: "Couldn't remove the extension",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const success = await ExtensionConnector.disconnect();
      if (success) {
        console.log({
          title: "Extension Disconnected",
          description: "Your extension is no longer linked to the web app.",
        });
        setModalOpen(false);
        setConnected(false);
        setConnectionError(true);
        setModalType("install");
        setExtensionAvailable(false);
      } else {
        console.log({
          title: "Disconnection Failed",
          description: "Could not disconnect from the extension.",
          variant: "destructive",
        });
        setConnected(false);
        setExtensionAvailable(false);
        setConnectionError(true);
      }
    } catch (error) {
      console.error('Disconnection error:', error);
      console.log({
        title: "Disconnection Error",
        description: "Failed to disconnect from extension.",
        variant: "destructive",
      });
      setConnected(false);
      setExtensionAvailable(false);
      setConnectionError(true);
    }
  };

  const PlatformIcon = ({ platform, className }: { platform: string; className?: string }) => {
    const icons: Record<string, React.JSX.Element> = {
      netflix: <RiNetflixFill className={`text-red-500 ${className}`} />,
      hulu: <Tv2 className={className} />, 
      disney: <Tv2 className={className} />,
      prime: <Tv2 className={className} />,
      hbo: <Tv2 className={className} />,
      default: <Tv2 className={className} />
    };

    return icons[platform.toLowerCase()] || icons.default;
  };

  const handleNextTourStep = () => {
    if (tourStep < walkthroughSteps.length - 1) {
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

  const handleInstallClick = async () => {
    const isInstalled = await ExtensionConnector.isExtensionInstalled();
    
    if (isInstalled && extensionAvailable) {
      setModalType('manage');
    } else {
      setModalType('install');
      setInstallGuide(1);
    }

    setConnectionError(false);
    setModalOpen(true);
  };

  const step2 = () => {
    setInstallGuide(2);
    setTimeout(() => setInstallGuide(3), 2000);
  }

  // const step3 = async () => {
  //   setIsConnecting(true);
  //   try {
  //     await handleConnect();
  //   } finally {
  //     setIsConnecting(false);
  //   }
  // }
  const step3 = async () => {
    setIsConnecting(true);
    try {
      handleConnect();
      await handleNextStep(3);
    } catch (error) {
      setConnectionError(true);
    } finally {
      setIsConnecting(false);
    }
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
            <h3 className="text-xl font-bold mb-2">{walkthroughSteps[tourStep].title}</h3>
            <p className="text-muted-foreground mb-6">{walkthroughSteps[tourStep].content}</p>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevTourStep}
                disabled={tourStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => {
                  if (tourStep === walkthroughSteps.length - 1) {
                    completeTour();
                  } else {
                    handleNextTourStep();
                  }
                }}
              >
                {tourStep === walkthroughSteps.length - 1 ? "Finish Tour" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 flex justify-center gap-1">
              {walkthroughSteps.map((_, index) => (
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
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="h-3 w-3 mr-1"/>
              +{userWords.filter(w => w.is_new).length} this week
            </div>
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
            <CardDescription>Retention</CardDescription>
            <CardTitle className="text-2xl">0%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Review words regularly to improve</p>
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
          {(extensionId && connected && extensionAvailable) && (
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
          <div className="space-y-3 pb-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-8">
              {userWords.map((word) => (
                <div 
                  key={word.id}
                  className="relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-video">
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={word.show_name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <Play className="h-10 w-10 text-white/50 group-hover:text-white/80 transition-colors" />
                      </div>
                    )}
                    
                    {word.platform && (
                      <div className="absolute right-3 top-3 z-10 bg-background/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <PlatformIcon platform={word.platform} className="h-5 w-5" />
                      </div>
                    )}
                    
                    <Badge className="absolute left-3 top-3 bg-background/90 backdrop-blur-sm text-foreground hover:bg-background border border-gray-100 dark:border-gray-700">
                      <Tv2 className="h-3.5 w-3.5 mr-1" />
                      S{word.season} • E{word.episode}
                    </Badge>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight line-clamp-1">
                          {word.word}
                          {word.is_new && (
                            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize mt-1">
                          {word.part_of_speech}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-48">
                          <DropdownMenuItem className="gap-2">
                            <Bookmark className="h-4 w-4" />
                            Save to collection
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Add note
                          </DropdownMenuItem>
                          <DropdownMenuSeparator/>
                          <DropdownMenuItem className="gap-2 text-red-500">
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm line-clamp-2 mb-3">{word.definition}</p>
                    
                    {word.example && (
                      <div className="px-3 py-2 mb-4 text-xs italic bg-accent/20 dark:bg-accent/10 rounded-lg border border-accent/30 line-clamp-2">
                        "{word.example}"
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate max-w-[120px]">
                          {word.show_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span className="text-xs">
                          {new Date(Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (extensionId && connected && extensionAvailable) ? (
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
              <Button variant="outline" onClick={() => setOpenPlatforms(true)}>
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

      <Dialog open={openPlatforms} onOpenChange={setOpenPlatforms}>
        <DialogContent className="sm:max-w-[580px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Monitor className="h-6 w-6" />
              Supported Platforms
            </DialogTitle>
            <DialogDescription>
              Works seamlessly with these streaming services
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="flex flex-col items-center p-6 rounded-xl border bg-gradient-to-b from-card to-muted/50 hover:shadow-md transition-all">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-4">
                <RiNetflixFill className="w-8 h-8 text-red-500"/>
              </div>
              <h4 className="font-medium text-lg">Netflix</h4>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Full subtitle support for all shows and movies
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-xl border bg-gradient-to-b from-card to-muted/50 hover:shadow-md transition-all">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/10 mb-4">
                <svg width="46" height="14" viewBox="0 0 46 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_247_462)">
                  <path d="M22.5404 13.9999V13.9772C22.5632 13.9487 22.603 13.9317 22.6371 13.9374C22.8019 13.9317 22.9611 13.9317 23.1259 13.9374C23.16 13.9374 23.1998 13.9487 23.2225 13.9772V13.9999H22.5404Z" fill="#D1EFFA"/>
                  <path d="M23.2225 13.9778C22.9951 13.9721 22.7677 13.9721 22.5404 13.9778C22.2277 13.9607 21.9151 13.9494 21.6025 13.9266C20.7726 13.8641 19.9484 13.7391 19.1413 13.5515C16.3504 12.9035 13.9005 11.6018 11.7633 9.70902C11.5643 9.53281 11.3767 9.35092 11.1835 9.16903C11.138 9.12924 11.0982 9.0724 11.0755 9.01556C11.0414 8.93598 11.0584 8.85072 11.1153 8.78819C11.1721 8.72567 11.2631 8.70293 11.3426 8.73703C11.3938 8.75977 11.445 8.78251 11.4904 8.81093C13.531 10.0728 15.7592 10.9936 18.0954 11.5393C18.8798 11.7212 19.6699 11.8633 20.4657 11.9656C21.6082 12.1077 22.762 12.1589 23.9102 12.1191C24.5298 12.102 25.1437 12.0452 25.7576 11.9656C27.19 11.7837 28.6053 11.4597 29.9752 11.005C30.6971 10.7663 31.4019 10.4934 32.0897 10.1751C32.192 10.1183 32.3171 10.1012 32.4307 10.1296C32.6183 10.1751 32.732 10.3684 32.6865 10.556C32.6808 10.5787 32.6695 10.6071 32.6581 10.6298C32.6126 10.7151 32.5501 10.789 32.4705 10.8458C31.8169 11.3574 31.112 11.8065 30.3674 12.1816C28.9634 12.8921 27.4628 13.398 25.9167 13.6879C25.0243 13.8471 24.1262 13.9437 23.2225 13.9778Z" fill="#00A8E1"/>
                  <path d="M14.8044 2.45571C14.9465 2.37045 15.0943 2.2795 15.2477 2.19992C15.6456 1.99529 16.089 1.89298 16.538 1.91572C16.862 1.93277 17.1576 2.02371 17.385 2.26245C17.601 2.48413 17.6805 2.75697 17.7033 3.05254C17.709 3.11507 17.709 3.17759 17.709 3.2458V6.19018C17.709 6.44596 17.6749 6.48007 17.4191 6.48007H16.7256C16.6801 6.48007 16.6347 6.48007 16.5892 6.47438C16.521 6.4687 16.4641 6.41186 16.4528 6.34365C16.4414 6.28112 16.4414 6.2186 16.4414 6.15607V3.52432C16.4471 3.41632 16.4357 3.31401 16.4073 3.2117C16.3618 3.03549 16.2027 2.91044 16.0208 2.89907C15.6854 2.87633 15.35 2.94454 15.0431 3.08665C14.9976 3.09801 14.9692 3.14349 14.9749 3.18896V6.17881C14.9749 6.23565 14.9749 6.28681 14.9635 6.34365C14.9635 6.42323 14.901 6.48007 14.8214 6.48007C14.7362 6.48575 14.6509 6.48575 14.56 6.48575H13.9574C13.7471 6.48575 13.7016 6.4346 13.7016 6.22428V3.53569C13.7016 3.43906 13.696 3.33675 13.6732 3.24012C13.6334 3.04686 13.4686 2.91044 13.2753 2.89907C12.9343 2.87633 12.5876 2.94454 12.2806 3.09233C12.2351 3.1037 12.2067 3.15485 12.2181 3.20033V6.22997C12.2181 6.44028 12.1726 6.48575 11.9623 6.48575H11.2006C11.0017 6.48575 10.9505 6.42891 10.9505 6.23565V2.29087C10.9505 2.24539 10.9562 2.19992 10.9676 2.15445C10.9903 2.08624 11.0585 2.04645 11.1267 2.04645H11.8373C11.9396 2.04645 12.0021 2.10898 12.0362 2.20561C12.0646 2.28518 12.0817 2.35908 12.1101 2.44434C12.1669 2.44434 12.201 2.40455 12.2408 2.38181C12.5535 2.18855 12.8831 2.02371 13.2526 1.9555C13.5368 1.89866 13.821 1.89866 14.1052 1.9555C14.3724 2.01235 14.6111 2.1715 14.7646 2.39887C14.7759 2.41592 14.7873 2.42729 14.7987 2.43865C14.793 2.44434 14.7987 2.44434 14.8044 2.45571Z" fill="#00A8E1"/>
                  <path d="M26.5876 5.28674C26.6217 5.17305 26.6558 5.06506 26.6899 4.95137C26.9513 4.07033 27.2128 3.19498 27.4743 2.31394L27.5084 2.21162C27.5368 2.10931 27.6334 2.04678 27.7358 2.04678H28.5997C28.8157 2.04678 28.8612 2.10931 28.7873 2.31394L28.4463 3.21771C28.0654 4.20675 27.6846 5.20147 27.3038 6.19051C27.2924 6.22462 27.2753 6.25872 27.264 6.29283C27.2242 6.41219 27.1048 6.49177 26.9798 6.4804C26.7297 6.47472 26.4796 6.47472 26.2295 6.4804C26.0532 6.48609 25.9509 6.40651 25.8884 6.24735C25.7463 5.8722 25.5985 5.49136 25.4564 5.11621C25.1154 4.2238 24.7686 3.3314 24.4276 2.43331C24.3935 2.3651 24.3707 2.28552 24.3537 2.21162C24.3366 2.09794 24.3764 2.0411 24.4901 2.0411C24.8141 2.03542 25.1381 2.0411 25.4564 2.0411C25.5928 2.0411 25.6554 2.13205 25.6895 2.25141C25.752 2.46741 25.8145 2.68909 25.8827 2.90509C26.1158 3.69518 26.3431 4.49096 26.5762 5.28105C26.5705 5.28674 26.5762 5.28674 26.5876 5.28674Z" fill="#232F3E"/>
                  <path d="M6.40312 2.67111C6.4429 2.65974 6.47701 2.63701 6.49975 2.6029C6.60206 2.50059 6.71006 2.40396 6.82374 2.31301C7.11932 2.08565 7.48878 1.97197 7.85825 2.00039C8.00604 2.00607 8.0572 2.05154 8.06856 2.19365C8.07993 2.38691 8.07425 2.58585 8.07425 2.77911C8.07993 2.85869 8.07425 2.93258 8.06288 3.01216C8.04014 3.11447 8.00035 3.15426 7.89804 3.16563C7.81846 3.17132 7.74457 3.16563 7.66499 3.15995C7.28416 3.12584 6.91469 3.19974 6.55659 3.3191C6.47701 3.34752 6.47701 3.40436 6.47701 3.46689V6.19527C6.47701 6.24643 6.47701 6.2919 6.47133 6.34306C6.46564 6.41695 6.4088 6.47379 6.33491 6.47379C6.29512 6.47948 6.24964 6.47948 6.20986 6.47948H5.47092C5.43113 6.47948 5.38566 6.47948 5.34587 6.47379C5.27198 6.46811 5.21513 6.40558 5.20945 6.33169C5.20377 6.28622 5.20377 6.24074 5.20377 6.19527V2.33006C5.20377 2.0686 5.23219 2.04017 5.49366 2.04017H6.03933C6.18712 2.04017 6.25533 2.09133 6.29512 2.23343C6.33491 2.37554 6.36901 2.51764 6.40312 2.67111Z" fill="#00A8E1"/>
                  <path d="M32.9936 8.43555C33.3687 8.44692 33.7382 8.46965 34.102 8.56628C34.2043 8.5947 34.3009 8.62881 34.3975 8.67428C34.5283 8.72544 34.6135 8.85049 34.6306 8.98691C34.6533 9.14606 34.659 9.3109 34.6476 9.47574C34.5737 10.4477 34.2725 11.3856 33.7723 12.2212C33.5904 12.5224 33.3687 12.7953 33.1129 13.034C33.0618 13.0852 32.9992 13.1249 32.931 13.1477C32.823 13.1761 32.7548 13.1193 32.7491 13.0113C32.7548 12.9544 32.7662 12.8976 32.7889 12.8407C32.9879 12.3064 33.1811 11.7778 33.3346 11.2265C33.4256 10.9252 33.4881 10.6183 33.5279 10.3056C33.5392 10.1919 33.5449 10.0783 33.5336 9.96458C33.5279 9.77132 33.4028 9.60648 33.2152 9.54964C33.039 9.49279 32.8571 9.45869 32.6696 9.44732C32.1466 9.42458 31.6237 9.44732 31.1064 9.51553L30.4186 9.60079C30.3448 9.60648 30.2765 9.60079 30.2368 9.53258C30.197 9.46437 30.214 9.39616 30.2538 9.32796C30.2993 9.26543 30.3561 9.20859 30.4243 9.1688C30.845 8.86754 31.3167 8.68565 31.8169 8.56628C32.2035 8.4867 32.5957 8.44692 32.9936 8.43555Z" fill="#00A8E1"/>
                  <path d="M30.6118 4.26271V6.30899C30.6004 6.42267 30.5493 6.47383 30.4356 6.47952C30.1287 6.4852 29.8274 6.4852 29.5205 6.47952C29.4068 6.47952 29.3556 6.42267 29.3442 6.31468C29.3386 6.28057 29.3386 6.24078 29.3386 6.20668V2.27326C29.3442 2.09706 29.3897 2.0459 29.5659 2.0459H30.3844C30.5607 2.0459 30.6118 2.09706 30.6118 2.27326V4.26271Z" fill="#232F3E"/>
                  <path d="M8.62003 4.25103V2.23317C8.62572 2.09675 8.67687 2.04559 8.81329 2.03991C9.10887 2.03422 9.40444 2.03422 9.70002 2.03991C9.83075 2.03991 9.87054 2.0797 9.88191 2.21043C9.88759 2.26159 9.88759 2.30706 9.88759 2.35822V6.14385C9.88759 6.20637 9.88191 6.2689 9.87622 6.33142C9.87054 6.40532 9.8137 6.45647 9.73981 6.46216C9.7057 6.46784 9.67728 6.46784 9.64318 6.46784H8.85308C8.82466 6.46784 8.80193 6.46784 8.77351 6.46216C8.69393 6.45647 8.62572 6.39395 8.62003 6.31437C8.61435 6.2689 8.61435 6.22342 8.61435 6.17795C8.62003 5.54701 8.62003 4.89902 8.62003 4.25103Z" fill="#00A8E1"/>
                  <path d="M9.27934 0.0059719C9.37028 0.000287775 9.46123 0.0173402 9.54649 0.0457608C9.85343 0.148075 10.0126 0.415229 9.98417 0.761961C9.96143 1.05754 9.73975 1.29627 9.44418 1.34174C9.31913 1.36448 9.18839 1.36448 9.06334 1.34174C8.73934 1.27922 8.50061 1.04048 8.52335 0.631226C8.55745 0.227653 8.82461 0.0059719 9.27934 0.0059719Z" fill="#00A8E1"/>
                  <path d="M29.9809 0.00485014C30.0946 -0.00651811 30.2083 0.0162184 30.3163 0.0616914C30.5379 0.146953 30.6914 0.351582 30.7028 0.590315C30.7483 1.10757 30.4015 1.36904 29.9411 1.35767C29.8786 1.35767 29.8161 1.3463 29.7535 1.33494C29.4011 1.24967 29.2192 0.976836 29.2533 0.584631C29.2817 0.272004 29.5262 0.0389549 29.8615 0.0105343C29.9013 0.00485014 29.9411 -0.000833984 29.9809 0.00485014Z" fill="#232F3E"/>
                  <path d="M4.36259 3.78539C4.33986 3.48982 4.26028 3.19993 4.14091 2.93278C3.90786 2.44394 3.54976 2.08584 3.00409 1.96079C2.37883 1.82437 1.8161 1.96079 1.30453 2.34163C1.27043 2.37573 1.23064 2.40415 1.18517 2.42689C1.1738 2.4212 1.16243 2.41552 1.16243 2.40984C1.14538 2.35299 1.13401 2.29615 1.11696 2.23931C1.07148 2.09721 1.01464 2.04605 0.861172 2.04605C0.690648 2.04605 0.51444 2.05174 0.343916 2.04605C0.213181 2.04037 0.0938147 2.05742 0.00286865 2.15973C0.00286865 4.14918 0.00286865 6.14431 0.00855278 8.12807C0.0824464 8.24743 0.196129 8.27017 0.326864 8.26448C0.531492 8.2588 0.736121 8.26448 0.940749 8.26448C1.29885 8.26448 1.29885 8.26448 1.29885 7.91207V6.29209C1.29885 6.2523 1.2818 6.20683 1.32159 6.17273C1.60579 6.39441 1.95252 6.53083 2.31062 6.56493C2.81083 6.61609 3.26556 6.49104 3.64639 6.14999C3.92491 5.8942 4.12954 5.56453 4.23754 5.20074C4.39101 4.73464 4.40238 4.26286 4.36259 3.78539ZM3.00409 4.96201C2.9643 5.13822 2.87335 5.29737 2.74262 5.41674C2.59483 5.54179 2.41294 5.61568 2.21968 5.61568C1.92979 5.63273 1.64558 5.57021 1.3898 5.43379C1.32727 5.40537 1.28748 5.34284 1.29317 5.27463V4.24581C1.29317 3.90476 1.29885 3.56371 1.29317 3.22267C1.28748 3.14309 1.33295 3.07488 1.40685 3.04646C1.71947 2.89867 2.04347 2.83046 2.38452 2.89867C2.62325 2.93278 2.82788 3.08625 2.92451 3.30793C3.00977 3.48982 3.06093 3.68876 3.0723 3.88771C3.1064 4.25149 3.1064 4.61528 3.00409 4.96201Z" fill="#00A8E1"/>
                  <path d="M45.4871 3.91164V3.93437C45.4644 3.91164 45.453 3.87753 45.4644 3.84911V3.80364C45.4644 3.80364 45.4644 3.79796 45.4701 3.79796H45.4644V3.74111H45.4758C45.4758 3.73543 45.4701 3.73543 45.4701 3.72975C45.4587 3.62175 45.436 3.51375 45.4076 3.41143C45.1973 2.66113 44.7255 2.16661 43.9581 1.97335C43.6 1.88809 43.2362 1.87672 42.8724 1.93356C42.1051 2.04724 41.5537 2.4565 41.2866 3.18407C41.0251 3.87753 41.0308 4.63921 41.2923 5.33267C41.5196 5.96361 41.9744 6.3615 42.628 6.52634C42.9748 6.6116 43.3385 6.63433 43.6966 6.58318C44.8903 6.44107 45.3848 5.5373 45.4644 4.75289H45.4587V4.67331C45.453 4.63921 45.4474 4.61078 45.4815 4.58805V4.59942C45.4815 4.59373 45.4871 4.58236 45.4928 4.57668V3.92301C45.4928 3.91732 45.4871 3.91732 45.4871 3.91164ZM44.123 4.99162C44.0888 5.11099 44.0377 5.21899 43.9638 5.3213C43.8387 5.49751 43.6398 5.61119 43.4238 5.62824C43.3158 5.63961 43.2078 5.63961 43.0998 5.61688C42.8611 5.5714 42.6621 5.41225 42.5655 5.19057C42.4802 5.01436 42.4291 4.8211 42.412 4.62784C42.3836 4.29247 42.3779 3.95711 42.4575 3.62743C42.4859 3.4967 42.5428 3.36596 42.611 3.25228C42.736 3.04765 42.952 2.91692 43.1908 2.89986C43.2988 2.8885 43.4068 2.8885 43.5148 2.91123C43.7421 2.9567 43.9297 3.10449 44.032 3.3148C44.1286 3.51375 44.1855 3.73543 44.1968 3.95711C44.2025 4.05942 44.2082 4.16174 44.2025 4.26405C44.2196 4.51415 44.1912 4.75857 44.123 4.99162Z" fill="#232F3E"/>
                  <path d="M35.5229 0.0458984H34.7328C34.5168 0.0458984 34.4771 0.0856873 34.4771 0.301684V2.14334C34.4771 2.18313 34.4941 2.22292 34.4657 2.26271C34.4145 2.25702 34.3861 2.22292 34.3463 2.20018C33.7552 1.85345 33.1356 1.79092 32.5103 2.08082C32.0727 2.28544 31.7998 2.65491 31.6236 3.09259C31.4531 3.51322 31.4133 3.95658 31.4247 4.40562C31.4247 4.82625 31.5213 5.24119 31.7089 5.61634C31.9249 6.03128 32.2375 6.34959 32.6922 6.48601C33.3118 6.67927 33.8916 6.58264 34.4202 6.19044C34.46 6.1677 34.4827 6.12791 34.5339 6.11654C34.5623 6.17907 34.5851 6.24728 34.5964 6.31549C34.6192 6.40643 34.6987 6.46896 34.7954 6.46896H34.9318C35.1364 6.46896 35.3354 6.47464 35.5343 6.46896C35.6935 6.46896 35.7389 6.4178 35.7446 6.25296V0.261895C35.7389 0.0856873 35.6935 0.0458984 35.5229 0.0458984ZM34.4827 4.22941V5.26393C34.4941 5.33213 34.4543 5.39466 34.3918 5.42308C34.119 5.57655 33.8063 5.63908 33.4994 5.5936C33.2379 5.56518 33.0105 5.40603 32.8912 5.17298C32.8002 4.99109 32.7491 4.79783 32.732 4.59888C32.6866 4.24078 32.715 3.877 32.8002 3.53027C32.8287 3.43364 32.8628 3.34269 32.9139 3.25175C33.0333 3.03006 33.2607 2.88796 33.5108 2.87091C33.812 2.84249 34.1133 2.89933 34.3861 3.02438C34.4543 3.04712 34.4941 3.11533 34.4884 3.18922C34.4771 3.54164 34.4827 3.88268 34.4827 4.22941Z" fill="#232F3E"/>
                  <path d="M19.7836 4.62147C20.2099 4.70104 20.6476 4.70673 21.0739 4.63852C21.324 4.60441 21.5628 4.53052 21.7844 4.41115C22.0402 4.26337 22.2278 4.05874 22.3074 3.77453C22.5063 3.05833 22.1994 2.33645 21.4548 2.06929C21.091 1.94993 20.7045 1.91014 20.3236 1.96129C19.4255 2.06361 18.8401 2.55813 18.5729 3.41643C18.3853 4.0019 18.4081 4.59873 18.5615 5.18988C18.7605 5.94587 19.2607 6.39491 20.0167 6.55407C20.4487 6.6507 20.8864 6.63365 21.3183 6.56544C21.5457 6.52565 21.7731 6.46881 21.9891 6.38354C22.1198 6.33239 22.188 6.25281 22.1823 6.10502C22.1766 5.9686 22.1823 5.8265 22.1823 5.6844C22.1823 5.51387 22.1141 5.46272 21.9493 5.50251C21.7844 5.54229 21.6253 5.5764 21.4604 5.6105C21.108 5.6844 20.7442 5.6844 20.3918 5.62187C19.9087 5.52524 19.5961 5.1103 19.6245 4.59873C19.6756 4.60441 19.7325 4.6101 19.7836 4.62147ZM19.6415 3.75179C19.6586 3.61538 19.6984 3.48464 19.7495 3.35959C19.92 2.94465 20.2782 2.80255 20.6419 2.82528C20.7442 2.83097 20.8466 2.8537 20.9432 2.89349C21.091 2.95602 21.1876 3.09244 21.2047 3.25159C21.2217 3.34822 21.216 3.45054 21.1876 3.54717C21.1194 3.75179 20.9546 3.83706 20.7556 3.87684C20.6363 3.90527 20.5112 3.91663 20.3861 3.90527C20.1645 3.90527 19.9371 3.88821 19.7154 3.85411C19.6302 3.84274 19.6302 3.84274 19.6415 3.75179Z" fill="#00A8E1"/>
                  <path d="M38.9561 4.67728C39.2858 4.65454 39.6155 4.59202 39.9111 4.43286C40.2123 4.28507 40.4226 4.00655 40.4852 3.67687C40.5249 3.47224 40.5249 3.25625 40.4795 3.05162C40.3601 2.54005 40.0361 2.22174 39.5473 2.0569C39.2744 1.97163 38.9845 1.93753 38.7003 1.9489C37.7454 1.97163 37.0178 2.45479 36.7223 3.40972C36.5233 4.04066 36.5517 4.68296 36.745 5.3139C36.944 5.96189 37.3987 6.35409 38.0467 6.5303C38.3252 6.59851 38.6151 6.62693 38.8993 6.61556C39.3142 6.60988 39.7292 6.5303 40.1214 6.38252C40.2862 6.31999 40.326 6.26315 40.326 6.08694V5.67768C40.3203 5.51284 40.2521 5.456 40.0873 5.49579C39.9622 5.5299 39.8429 5.55832 39.7178 5.58674C39.337 5.67768 38.9391 5.69474 38.5526 5.62653C38.166 5.55263 37.9046 5.33095 37.8023 4.94443C37.7738 4.83075 37.7511 4.71707 37.7397 4.5977C37.7681 4.5977 37.7966 4.5977 37.8193 4.60907C38.1945 4.67728 38.5753 4.7057 38.9561 4.67728ZM37.7681 3.76782C37.8079 3.54614 37.8591 3.33014 37.9955 3.14825C38.2058 2.86973 38.4957 2.79015 38.8254 2.82425C38.8538 2.82425 38.8766 2.83562 38.905 2.83562C39.3029 2.89815 39.3995 3.21646 39.3256 3.5234C39.2688 3.75077 39.0812 3.83603 38.8709 3.87582C38.7572 3.89855 38.6378 3.90992 38.5185 3.90424C38.2854 3.89855 38.058 3.8815 37.8307 3.8474C37.7795 3.84171 37.7568 3.81898 37.7681 3.76782Z" fill="#232F3E"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_247_462">
                  <rect width="45.4901" height="14" fill="white" transform="translate(0.00286865)"/>
                  </clipPath>
                  </defs>
                </svg>
              </div>
              <h4 className="font-medium text-lg">Prime Video</h4>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Works with English subtitled content
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-xl border bg-gradient-to-b from-card to-muted/50 hover:shadow-md transition-all">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-4">
                <RiYoutubeFill className="w-8 h-8 text-red-500"/>
              </div>
              <h4 className="font-medium text-lg">YouTube</h4>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Works with captions on most videos
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-xl border border-dashed bg-gradient-to-b from-card to-muted/10 hover:shadow-md transition-all">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-lg">More Coming</h4>
              <p className="text-sm text-muted-foreground text-center mt-2">
                We're adding new platforms regularly
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setOpenPlatforms(false)}>
              Got It!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isMobile ? (
                <div className="flex items-center gap-2">
                  <Smartphone className="h-6 w-6"/>
                  <span>Desktop Required</span>
                </div>
              ) : modalType === 'manage' ? (
                <div className="flex items-center gap-2">
                  <SettingsIcon className="w-6 h-6"/>
                  <span>Manage Extension</span>
                </div>
              ) : connectionError && extensionId ? (
                <div className="flex items-center gap-2 text-red-600">
                  <XIcon className="w-6 h-6"/>
                  <span>Connection Failed</span>
                </div>
              ) : installGuide === 3 && extensionId && connected && extensionAvailable ? (
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
                : modalType === 'manage'
                ? "View and control your extension connection"
                : connectionError && extensionId
                ? "Couldn't connect to the extension. Please make sure it's installed and try again."
                : installGuide === 3 && extensionId && connected && extensionAvailable
                ? "Your extension is now connected to the web app. Start collecting words!"
                : "Follow these simple steps to start learning from your favorite shows"
              }
            </DialogDescription>
          </DialogHeader>

          {isMobile ? (
            <div className="py-4 space-y-6">
              <div className="flex justify-center items-center gap-8 py-4">
                <div className="flex flex-col items-center">
                  <Smartphone className="h-16 w-16 text-muted-foreground mb-2"/>
                  <span className="text-sm text-muted-foreground">Mobile</span>
                  <XIcon className="h-8 w-8 text-red-500 my-2"/>
                </div>
                <div className="flex flex-col items-center">
                  <Monitor className="h-16 w-16 text-muted-foreground mb-2"/>
                  <span className="text-sm text-muted-foreground">Desktop</span>
                  <CheckIcon className="h-8 w-8 text-green-500 my-2"/>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Please visit Scribe on your desktop to install the extension 
                </p>
                <p className="text-sm text-muted-foreground">
                  Supported browsers: Chrome, Edge, Firefox
                </p>
              </div>

              <Button 
                className="w-full mt-6" 
                onClick={() => setModalOpen(false)}
              >
                Understood
              </Button>
            </div>
          ) : modalType === 'manage' ? (
            <div className="py-4 space-y-6">
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <CheckIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Extension Connected</h3>
                    <p className="text-sm text-muted-foreground">
                      Your Scribe extension is active and working properly
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-medium mb-3">Connection Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last sync</span>
                      <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Words collected</span>
                      <span className="text-sm font-medium">{userWords.length}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-medium mb-3">Extension Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Version</span>
                      <span className="text-sm font-medium">1.2.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last updated</span>
                      <span className="text-sm font-medium">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleDisconnect}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1">
                      <PowerIcon className="mr-2 h-4 w-4 text-white" />
                      <h1 className="text-white">Remove</h1>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove the extension connection. You&apos;ll need to reinstall to use it again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                      onClick={handleRemoveExtension}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Remove Extension
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="relative mb-8 ml-4">
                <div className="absolute left-[18px] top-0 h-full w-0.5 bg-border -z-10" />
                <div 
                  className="absolute left-[18px] top-0 w-0.5 bg-primary transition-all duration-500 -z-10" 
                  style={{ height: `${((installGuide - 1) / (guide.length - 1)) * 100}%` }}
                />

                <div className="space-y-8">
                  {guide.map((step) => (
                    <div 
                      key={step.id}
                      className={`flex gap-6 transition-all duration-300 ${installGuide < step.id ? "opacity-50" : ""}`}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full border-2 ${
                          installGuide > step.id 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : installGuide === step.id 
                              ? "border-primary" 
                              : "border-border"
                        }`}>
                          {installGuide > step.id ? (
                            <CheckIcon className="h-5 w-5" />
                          ) : (
                            step.icon
                          )}
                        </div>
                      </div>

                      <div className={`flex-1 pb-8 ${installGuide === step.id ? "" : "border-b"}`}>
                        <h3 className={`text-lg font-semibold ${
                          installGuide === step.id ? "text-primary" : "text-foreground"
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground mt-1">{step.description}</p>
                        {installGuide === 3 && step.id === 3 && (
                          <div className="mt-4">
                            <Label htmlFor="extension-id" className="mb-1 block">Extension ID</Label>
                            <Input
                              id="extension-id"
                              placeholder="Paste your extension ID here"
                              value={extensionId}
                              onChange={e => setExtensionId(e.target.value)}
                              className="mb-2"
                              autoFocus
                            />
                            {extensionId === '' && (
                              <div className="text-xs text-destructive">Extension ID is required to connect.</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                  <Button onClick={() => handleNextStep(installGuide + 1)}>
                    {installGuide == 1 ? "Install Extension" : "Next Step"}
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={handleReset}
                      disabled={isConnecting}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Start Over
                    </Button>
                    {(extensionId && connected && extensionAvailable) && (
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
                      onClick={async () => {
                        if (extensionId.trim() === '') return;
                        ExtensionConnector.setExtensionId(extensionId.trim());
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('extensionId', extensionId.trim());
                        }
                        const { data: { user } } = await supabase.auth.getUser();
                        if (user) {
                          await supabase.auth.updateUser({
                            data: {
                              ...user.user_metadata,
                              extensionId: extensionId.trim(),
                            }
                          });
                        }
                        step3();
                      }}
                      disabled={isConnecting || (extensionId && connected && extensionAvailable) || extensionId.trim() === ''}
                      className="flex-1"
                      variant={connectionError ? "destructive" : (extensionId && connected && extensionAvailable) ? "default" : "default"}
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
                      ) : (extensionId && connected && extensionAvailable) ? (
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

              <div className="mt-12 border-t pt-6">
                <h4 className="text-sm font-medium mb-3">Need help?</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://github.com/DawnSaju/Scribe-Extension" target="_blank" className="flex items-center">
                      <RiGithubFill className="mr-2 h-4 w-4" />
                      GitHub Repository
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://developer.chrome.com/docs/extensions/mv3/getstarted/" target="_blank" className="flex items-center">
                      <ChromeIcon className="mr-2 h-4 w-4" />
                      Chrome Extension Guide
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}