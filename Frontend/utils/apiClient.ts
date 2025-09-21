// API client for communicating with FastAPI backend
const API_BASE_URL = 'http://localhost:8000/api';

export interface Workout {
  id: string;
  exercise: string;
  sets: Array<{ reps: string; weight: string }>;
  duration: string;
  date: string;
  createdAt: string;
}

export interface Stats {
  totalWorkouts: number;
  workoutsThisMonth: number;
  currentStreak: number;
  weightData: Array<{ date: string; value: number }>;
  workoutData: Array<{ date: string; value: number }>;
}

export interface SuggestedExercise {
  id: string;
  name: string;
  category: string;
  muscle: string;
  lastPerformed: string;
  trend: 'up' | 'down' | 'same';
}

export interface ExerciseAnalysisRequest {
  exercise_type: string;
  sets: number;
  reps: number;
  video: File;
}

export interface ExerciseAnalysisResponse {
  exercise: string;
  planned_reps: number;
  completed_reps: number;
  form_score: number;
  mistakes: Array<{ description: string }>;
  timestamp: string;
}

export interface SessionCreate {
  user_id: number;
  exercise_type: string;
  planned_sets: number;
  planned_reps: number;
  completed_reps: number;
  form_score: number;
  mistakes: string[];
}

export interface SessionResponse extends SessionCreate {
  id: number;
  timestamp: string;
}

class ApiClient {
  // Workouts API
  async fetchWorkouts(): Promise<Workout[]> {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch workouts: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async saveWorkout(workoutData: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> {
    // For exercise analysis, we need to send video and exercise data
    // This would be handled separately in the recording flow
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutData),
    });

    if (!response.ok) {
      throw new Error(`Failed to save workout: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  // Stats API
  async fetchStats(): Promise<Stats> {
    // For now, we'll return mock data
    // In a real implementation, this would calculate stats from the sessions
    return {
      totalWorkouts: 12,
      workoutsThisMonth: 5,
      currentStreak: 3,
      weightData: [
        { date: '2025-09-01', value: 70 },
        { date: '2025-09-08', value: 71 },
        { date: '2025-09-15', value: 70.5 },
        { date: '2025-09-22', value: 71.2 },
      ],
      workoutData: [
        { date: '2025-09-01', value: 1 },
        { date: '2025-09-03', value: 1 },
        { date: '2025-09-05', value: 1 },
        { date: '2025-09-08', value: 1 },
        { date: '2025-09-10', value: 1 },
        { date: '2025-09-12', value: 1 },
        { date: '2025-09-15', value: 1 },
        { date: '2025-09-17', value: 1 },
        { date: '2025-09-19', value: 1 },
        { date: '2025-09-21', value: 1 },
        { date: '2025-09-22', value: 1 },
      ],
    };
  }

  // Suggested Exercises API
  async fetchSuggestedExercises(): Promise<SuggestedExercise[]> {
    // Return mock data for now
    return [
      {
        id: '1',
        name: 'Squats',
        category: 'Legs',
        muscle: 'Quadriceps',
        lastPerformed: '2025-09-19',
        trend: 'up',
      },
      {
        id: '2',
        name: 'Deadlifts',
        category: 'Back',
        muscle: 'Hamstrings',
        lastPerformed: '2025-09-17',
        trend: 'same',
      },
      {
        id: '3',
        name: 'Push-ups',
        category: 'Chest',
        muscle: 'Pectorals',
        lastPerformed: '2025-09-15',
        trend: 'down',
      },
    ];
  }

  // Exercise Analysis API
  async analyzeExercise(formData: FormData): Promise<ExerciseAnalysisResponse> {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to analyze exercise: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  // Sessions API
  async fetchSessions(): Promise<SessionResponse[]> {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async createSession(sessionData: SessionCreate): Promise<SessionResponse> {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }
}

export const apiClient = new ApiClient();