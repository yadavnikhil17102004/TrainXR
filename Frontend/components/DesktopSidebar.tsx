"use client";

import { Home, Camera, User, Glasses, Plus, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

interface DesktopSidebarProps {
  activeTab: 'home' | 'ar' | 'record' | 'profile';
  onTabChange: (tab: 'home' | 'ar' | 'record' | 'profile') => void;
  onRecordSession: () => void;
  onManualEntry: () => void;
}

export function DesktopSidebar({ activeTab, onTabChange, onRecordSession, onManualEntry }: DesktopSidebarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="hidden md:flex md:w-20 lg:w-64 h-screen bg-background border-r border-border flex-col dark:bg-gray-900">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold hidden lg:block">TrainXR</h1>
        <div className="lg:hidden">
          <div className="bg-accent w-8 h-8 rounded-md flex items-center justify-center dark:bg-accent">
            <span className="font-bold">T</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 py-4 space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "justify-start px-4 py-6 w-full hover:bg-accent hover:text-accent-foreground",
            activeTab === 'home' && "bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground"
          )}
          onClick={() => onTabChange('home')}
        >
          <Home className="h-6 w-6" />
          <span className="ml-3 hidden lg:inline">Home</span>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            "justify-start px-4 py-6 w-full hover:bg-accent hover:text-accent-foreground",
            activeTab === 'ar' && "bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground"
          )}
          onClick={() => onTabChange('ar')}
        >
          <Glasses className="h-6 w-6" />
          <span className="ml-3 hidden lg:inline">AR Assistant</span>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            "justify-start px-4 py-6 w-full hover:bg-accent hover:text-accent-foreground",
            activeTab === 'record' && "bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground"
          )}
          onClick={() => onTabChange('record')}
        >
          <Camera className="h-6 w-6" />
          <span className="ml-3 hidden lg:inline">Record Live</span>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            "justify-start px-4 py-6 w-full hover:bg-accent hover:text-accent-foreground",
            activeTab === 'profile' && "bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground"
          )}
          onClick={() => onTabChange('profile')}
        >
          <User className="h-6 w-6" />
          <span className="ml-3 hidden lg:inline">Profile</span>
        </Button>
      </div>
      
      <div className="p-4 border-t border-border">
        {/* Theme Toggle Button - Always visible */}
        <Button
          variant="ghost"
          size="icon"
          className="mb-2 w-full justify-start px-4 py-6 hidden lg:flex hover:bg-accent hover:text-accent-foreground"
          onClick={toggleTheme}
        >
          {mounted && theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          <span className="ml-3">Theme</span>
        </Button>
        
        {/* Theme Toggle Icon Button - Visible on smaller sidebar */}
        <Button
          variant="ghost"
          size="icon"
          className="mb-2 mx-auto lg:hidden hover:bg-accent hover:text-accent-foreground"
          onClick={toggleTheme}
        >
          {mounted && theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
        
        {/* Manual Entry Button */}
        <Button
          className="w-full py-6 hidden lg:flex dark:bg-accent dark:hover:bg-accent/90 hover:bg-accent/90 mb-2"
          onClick={onManualEntry}
        >
          <Plus className="h-5 w-5 mr-2" />
          Manual Entry
        </Button>
        <Button
          size="icon"
          className="rounded-full h-12 w-12 mx-auto lg:hidden dark:bg-accent dark:hover:bg-accent/90 hover:bg-accent/90 mb-2"
          onClick={onManualEntry}
        >
          <Plus className="h-6 w-6" />
        </Button>
        
        {/* Record Session Button */}
        <Button
          className="w-full py-6 hidden lg:flex dark:bg-accent dark:hover:bg-accent/90 hover:bg-accent/90"
          onClick={onRecordSession}
        >
          <Camera className="h-5 w-5 mr-2" />
          Record Session
        </Button>
        <Button
          size="icon"
          className="rounded-full h-12 w-12 mx-auto lg:hidden dark:bg-accent dark:hover:bg-accent/90 hover:bg-accent/90"
          onClick={onRecordSession}
        >
          <Camera className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}