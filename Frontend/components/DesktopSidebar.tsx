"use client";

import { Home, Camera, User, Glasses, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';

interface DesktopSidebarProps {
  activeTab: 'home' | 'ar' | 'record' | 'profile';
  onTabChange: (tab: 'home' | 'ar' | 'record' | 'profile') => void;
  onRecordSession: () => void;
}

export function DesktopSidebar({ activeTab, onTabChange, onRecordSession }: DesktopSidebarProps) {
  return (
    <div className="hidden md:flex md:w-20 lg:w-64 h-screen bg-background border-r border-border flex-col dark:bg-gray-900">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold hidden lg:block">GymTracker</h1>
        <div className="lg:hidden">
          <div className="bg-accent w-8 h-8 rounded-md flex items-center justify-center dark:bg-accent">
            <span className="font-bold">G</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 py-4 space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "justify-start px-4 py-6 w-full",
            activeTab === 'home' && "bg-accent dark:bg-accent"
          )}
          onClick={() => onTabChange('home')}
        >
          <Home className="h-6 w-6" />
          <span className="ml-3 hidden lg:inline">Home</span>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            "justify-start px-4 py-6 w-full",
            activeTab === 'ar' && "bg-accent dark:bg-accent"
          )}
          onClick={() => onTabChange('ar')}
        >
          <Glasses className="h-6 w-6" />
          <span className="ml-3 hidden lg:inline">AR Assistant</span>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            "justify-start px-4 py-6 w-full",
            activeTab === 'record' && "bg-accent dark:bg-accent"
          )}
          onClick={() => onTabChange('record')}
        >
          <Camera className="h-6 w-6" />
          <span className="ml-3 hidden lg:inline">Record Live</span>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            "justify-start px-4 py-6 w-full",
            activeTab === 'profile' && "bg-accent dark:bg-accent"
          )}
          onClick={() => onTabChange('profile')}
        >
          <User className="h-6 w-6" />
          <span className="ml-3 hidden lg:inline">Profile</span>
        </Button>
      </div>
      
      <div className="p-4 border-t border-border">
        <Button
          className="w-full py-6 hidden lg:flex dark:bg-accent dark:hover:bg-accent/90"
          onClick={onRecordSession}
        >
          <Plus className="h-5 w-5 mr-2" />
          Record Session
        </Button>
        <Button
          size="icon"
          className="rounded-full h-12 w-12 mx-auto lg:hidden dark:bg-accent dark:hover:bg-accent/90"
          onClick={onRecordSession}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}