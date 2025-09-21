"use client";

import { useState } from 'react';
import { BottomNavigation } from './components/BottomNavigation';
import { DesktopSidebar } from './components/DesktopSidebar';
import { HomeScreen } from './components/HomeScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { RecordSessionModal } from './components/RecordSessionModal';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { Plus } from 'lucide-react';
import { useWorkouts } from './hooks/useWorkouts';
import { toast } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const { saveWorkout } = useWorkouts();

  const handleRecordSession = () => {
    setIsRecordModalOpen(true);
  };

  const handleSaveSession = async (sessionData: any) => {
    try {
      await saveWorkout(sessionData);
      toast.success('Workout saved successfully!');
    } catch (error) {
      console.error('Failed to save workout:', error);
      toast.error('Failed to save workout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
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
            <div className="md:hidden bg-white border-b border-border p-4 mb-6">
              <h1 className="text-xl font-semibold">GymTracker</h1>
            </div>

            {/* Content Area */}
            <div className="p-4 md:p-0 pb-20 md:pb-0">
              {activeTab === 'home' && <HomeScreen onRecordSession={handleRecordSession} />}
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
        className="hidden md:flex fixed bottom-8 right-8 h-14 w-14 rounded-full bg-accent hover:bg-accent/90 shadow-lg z-40"
        onClick={handleRecordSession}
      >
        <Plus size={24} />
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