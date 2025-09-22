"use client";

import { Home, Camera, User, Glasses, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';

interface BottomNavigationProps {
  activeTab: 'home' | 'ar' | 'record' | 'profile';
  onTabChange: (tab: 'home' | 'ar' | 'record' | 'profile') => void;
  onRecordSession: () => void;
  onManualEntry: () => void;
}

export function BottomNavigation({ activeTab, onTabChange, onRecordSession, onManualEntry }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex flex-col items-center justify-center rounded-full h-auto py-2 px-3 hover:bg-accent hover:text-accent-foreground",
            activeTab === 'home' && "text-primary bg-accent dark:text-primary-foreground dark:bg-accent"
          )}
          onClick={() => onTabChange('home')}
        >
          <Home className="h-6 w-6 mb-1" />
          <span className="text-xs">Home</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex flex-col items-center justify-center rounded-full h-auto py-2 px-3 hover:bg-accent hover:text-accent-foreground",
            activeTab === 'ar' && "text-primary bg-accent dark:text-primary-foreground dark:bg-accent"
          )}
          onClick={() => onTabChange('ar')}
        >
          <Glasses className="h-6 w-6 mb-1" />
          <span className="text-xs">AR</span>
        </Button>
        
        {/* Manual Entry Button - Centered with proper spacing */}
        <div className="flex items-center justify-center">
          <Button
            size="icon"
            className="rounded-full h-14 w-14 bg-accent hover:bg-accent/90 shadow-lg dark:bg-accent dark:hover:bg-accent/90"
            onClick={onManualEntry}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex flex-col items-center justify-center rounded-full h-auto py-2 px-3 hover:bg-accent hover:text-accent-foreground",
            activeTab === 'record' && "text-primary bg-accent dark:text-primary-foreground dark:bg-accent"
          )}
          onClick={() => onTabChange('record')}
        >
          <Camera className="h-6 w-6 mb-1" />
          <span className="text-xs">Record</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex flex-col items-center justify-center rounded-full h-auto py-2 px-3 hover:bg-accent hover:text-accent-foreground",
            activeTab === 'profile' && "text-primary bg-accent dark:text-primary-foreground dark:bg-accent"
          )}
          onClick={() => onTabChange('profile')}
        >
          <User className="h-6 w-6 mb-1" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </div>
  );
}