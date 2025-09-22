"use client";

import { useState, useEffect } from 'react';
import { apiClient, Workout, Stats, SuggestedExercise } from '../utils/apiClient';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [suggestedExercises, setSuggestedExercises] = useState<SuggestedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async () => {
    try {
      const data = await apiClient.fetchWorkouts();
      setWorkouts(data);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
    }
  };

  const fetchStats = async () => {
    try {
      const data = await apiClient.fetchStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  };

  const fetchSuggestedExercises = async () => {
    try {
      const data = await apiClient.fetchSuggestedExercises();
      setSuggestedExercises(data);
    } catch (err) {
      console.error('Error fetching suggested exercises:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch suggested exercises');
    }
  };

  const saveWorkout = async (workoutData: Omit<Workout, 'id' | 'createdAt'>) => {
    try {
      const data = await apiClient.saveWorkout(workoutData);
      
      // Refresh all data after saving
      await Promise.all([
        fetchWorkouts(),
        fetchStats(),
        fetchSuggestedExercises()
      ]);
      
      return data;
    } catch (err) {
      console.error('Error saving workout:', err);
      setError(err instanceof Error ? err.message : 'Failed to save workout');
      throw err;
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchWorkouts(),
        fetchStats(),
        fetchSuggestedExercises()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    workouts,
    stats,
    suggestedExercises,
    loading,
    error,
    saveWorkout,
    refreshData,
  };
}