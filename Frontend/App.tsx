"use client";

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { BottomNavigation } from './components/BottomNavigation';
import { DesktopSidebar } from './components/DesktopSidebar';
import { HomeScreen } from './components/HomeScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { RecordSessionModal } from './components/RecordSessionModal';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { Sun, Moon, Camera, Glasses } from 'lucide-react';
import { toast } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'ar' | 'record' | 'profile'>('home');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Desktop Sidebar */}
        <DesktopSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRecordSession={handleRecordSession}
        />

        {/* Main Content */}
        <div className="flex-1 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-border p-4 mb-6 flex justify-between items-center dark:bg-gray-800 dark:border-gray-700">
              <h1 className="text-xl font-semibold">GymTracker</h1>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>

            {/* Content Area */}
            <div className="p-4 md:p-0 pb-20 md:pb-0">
              {activeTab === 'home' && <HomeScreen onRecordSession={handleRecordSession} />}
              {activeTab === 'ar' && (
                <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl dark:from-gray-800 dark:to-gray-900">
                  <div className="text-center max-w-md">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Glasses className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">AR Workout Assistant</h2>
                    <p className="text-muted-foreground mb-6 dark:text-gray-400">
                      Launch the AR camera overlay for real-time guidance and posture correction.
                    </p>
                    <Button 
                      className="dark:bg-accent dark:hover:bg-accent/90" 
                      onClick={handleRecordSession}
                    >
                      Start AR Session
                    </Button>
                  </div>
                </div>
              )}
              {activeTab === 'record' && (
                <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl dark:from-gray-800 dark:to-gray-900">
                  <div className="text-center max-w-md">
                    <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Record Live Session</h2>
                    <p className="text-muted-foreground mb-6 dark:text-gray-400">
                      Track your reps and form in real-time with camera-based pose detection.
                    </p>
                    <Button 
                      className="dark:bg-accent dark:hover:bg-accent/90" 
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
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRecordSession={handleRecordSession}
      />

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