"use client";

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, TrendingUp, Target } from 'lucide-react';
import { useState } from 'react';

interface HomeScreenProps {
  onRecordSession: () => void;
}

export function HomeScreen({ onRecordSession }: HomeScreenProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock data for suggested exercises
  const suggestedExercises = [
    { id: 1, name: 'Squats', category: 'Legs', icon: '🦵', description: 'Full body compound movement' },
    { id: 2, name: 'Push-ups', category: 'Chest', icon: '💪', description: 'Upper body strength exercise' },
    { id: 3, name: 'Deadlifts', category: 'Back', icon: '🔥', description: 'Posterior chain powerhouse' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white dark:from-blue-700 dark:to-purple-800">
        <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
        <p className="opacity-90">Ready for another great workout today?</p>
      </div>

      {/* Calendar Section */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>This Week</span>
            <Button variant="outline" size="sm" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
              View Month
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-full dark:bg-gray-800 dark:border-gray-700"
          />
        </CardContent>
      </Card>

      {/* Suggested Exercises */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Suggested Exercises</h2>
          <Button variant="ghost" size="sm">See All</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestedExercises.map((exercise) => (
            <Card key={exercise.id} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div className="text-3xl">{exercise.icon}</div>
                <div>
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">{exercise.category}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 dark:text-gray-400">{exercise.description}</p>
                <Button className="w-full" variant="outline" size="sm">
                  Start Exercise
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Dumbbell className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground dark:text-gray-400">+2 from last week</p>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 days</div>
              <p className="text-xs text-muted-foreground dark:text-gray-400">Keep it up!</p>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Goal</CardTitle>
              <Target className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100 reps</div>
              <p className="text-xs text-muted-foreground dark:text-gray-400">25 to go</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}