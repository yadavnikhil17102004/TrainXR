"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const workoutData = [
  { date: 'Mon', workouts: 2 },
  { date: 'Tue', workouts: 1 },
  { date: 'Wed', workouts: 3 },
  { date: 'Thu', workouts: 2 },
  { date: 'Fri', workouts: 4 },
  { date: 'Sat', workouts: 1 },
  { date: 'Sun', workouts: 2 },
];

const progressData = [
  { week: 'W1', progress: 65 },
  { week: 'W2', progress: 70 },
  { week: 'W3', progress: 75 },
  { week: 'W4', progress: 82 },
];

export function ProfileScreen() {
  return (
    <div className="space-y-6 w-full">
      {/* Profile Header */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
              <AvatarFallback className="dark:bg-gray-700">JD</AvatarFallback>
            </Avatar>
            
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">John Doe</h1>
              <p className="text-muted-foreground dark:text-gray-400">Fitness Enthusiast</p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                <Badge variant="secondary" className="dark:bg-gray-700">Beginner</Badge>
                <Badge variant="secondary" className="dark:bg-gray-700">🏋️ 12 Workouts</Badge>
                <Badge variant="secondary" className="dark:bg-gray-700">🔥 5 Day Streak</Badge>
              </div>
            </div>
            
            <div className="ml-auto">
              <Button variant="outline" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Workouts */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Weekly Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#334155',
                      color: 'white'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="workouts" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Progress Trend */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Progress Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="week" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#334155',
                      color: 'white'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Achievements */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 flex items-center gap-3 dark:border-gray-700">
              <div className="bg-blue-100 p-3 rounded-full dark:bg-blue-900/50">
                <span className="text-blue-600 text-xl dark:text-blue-400">🔥</span>
              </div>
              <div>
                <h3 className="font-medium">5 Day Streak</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Keep going!</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 flex items-center gap-3 dark:border-gray-700">
              <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/50">
                <span className="text-green-600 text-xl dark:text-green-400">💪</span>
              </div>
              <div>
                <h3 className="font-medium">First Workout</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Completed</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 flex items-center gap-3 dark:border-gray-700">
              <div className="bg-purple-100 p-3 rounded-full dark:bg-purple-900/50">
                <span className="text-purple-600 text-xl dark:text-purple-400">🏆</span>
              </div>
              <div>
                <h3 className="font-medium">10 Workouts</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Milestone reached</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}