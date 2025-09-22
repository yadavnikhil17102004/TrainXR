"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { BottomNavigation } from './components/BottomNavigation';
import { DesktopSidebar } from './components/DesktopSidebar';
import { HomeScreen } from './components/HomeScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { RecordSessionModal } from './components/RecordSessionModal';
import { ARView } from './components/ar/ARView';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { Sun, Moon, Camera, Glasses } from 'lucide-react';
import { toast } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'ar' | 'record' | 'profile'>('home');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRecordSession = () => {
    setIsRecordModalOpen(true);
  };

  const handleSaveSession = async (sessionData: any) => {
    try {
      console.log('Workout saved:', sessionData);
      toast.success('Workout saved successfully!');
    } catch (error) {
      console.error('Failed to save workout:', error);
      toast.error('Failed to save workout. Please try again.');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Prevent theme flashing on initial load
  if (!mounted) {
    return (
      <div className="min-h-screen">
        <div className="flex">
          {/* Loading skeleton for desktop sidebar */}
          <div className="hidden md:block w-20 lg:w-64 bg-gray-100 dark:bg-gray-800 h-screen" />
          
          {/* Loading skeleton for main content */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop Sidebar - Fixed width for md, variable for lg */}
      <div className="hidden md:block md:w-20 lg:w-64 flex-shrink-0">
        <DesktopSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRecordSession={handleRecordSession}
        />
      </div>

      {/* Main Content - Flexible width */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header - Only visible on mobile */}
        <div className="md:hidden bg-white border-b border-border p-4 mb-6 flex justify-between items-center dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold">GymTracker</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-6">
            {activeTab === 'home' && <HomeScreen onRecordSession={handleRecordSession} />}
            {activeTab === 'ar' && (
              <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-150px)]">
                <ARView />
              </div>
            )}
            {activeTab === 'record' && (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] md:min-h-[calc(100vh-150px)]">
                <div className="text-center max-w-md w-full">
                  <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Record Live Session</h2>
                  <p className="text-muted-foreground mb-6 dark:text-gray-400">
                    Track your reps and form in real-time with camera-based pose detection.
                  </p>
                  <Button 
                    className="bg-accent hover:bg-accent/90 dark:bg-accent dark:hover:bg-accent/90" 
                    onClick={handleRecordSession}
                  >
                    Start Recording
                  </Button>
                </div>
              </div>
            )}
            {activeTab === 'profile' && <ProfileScreen />}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <div className="md:hidden">
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRecordSession={handleRecordSession}
        />
      </div>

      {/* Floating Action Button for Desktop */}
      <Button
        className="hidden md:flex fixed bottom-8 right-8 h-14 w-14 rounded-full bg-accent hover:bg-accent/90 shadow-lg z-40 dark:bg-accent dark:hover:bg-accent/90"
        onClick={handleRecordSession}
      >
        +
      </Button>

      {/* Record Session Modal */}
      <RecordSessionModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSave={handleSaveSession}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}