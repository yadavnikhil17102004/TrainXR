"use client";

import { useState } from 'react';
import { apiClient, ExerciseAnalysisResponse } from '../utils/apiClient';

export function useExerciseAnalysis() {
  const [analysisResult, setAnalysisResult] = useState<ExerciseAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeExercise = async (
    exerciseType: string,
    sets: number,
    reps: number,
    videoFile: File
  ) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('exercise_type', exerciseType);
      formData.append('sets', sets.toString());
      formData.append('reps', reps.toString());
      formData.append('video', videoFile);
      
      const result = await apiClient.analyzeExercise(formData);
      setAnalysisResult(result);
      return result;
    } catch (err) {
      console.error('Error analyzing exercise:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze exercise');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return {
    analysisResult,
    isAnalyzing,
    error,
    analyzeExercise,
    clearAnalysis,
  };
}