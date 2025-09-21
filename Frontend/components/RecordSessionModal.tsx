"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useExerciseAnalysis } from '../Hooks/useExerciseAnalysis';
import { toast } from 'sonner';
import { Camera, Video, Square } from 'lucide-react';

interface RecordSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sessionData: any) => void;
}

export function RecordSessionModal({ isOpen, onClose, onSave }: RecordSessionModalProps) {
  const [exerciseType, setExerciseType] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { analyzeExercise, isAnalyzing, analysisResult, error, clearAnalysis } = useExerciseAnalysis();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        setVideoBlob(blob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast.error('Could not access camera. Please check permissions.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [isRecording]);

  const handleAnalyze = useCallback(async () => {
    if (!videoBlob || !exerciseType) {
      toast.error('Please record a video and select an exercise type.');
      return;
    }
    
    try {
      const videoFile = new File([videoBlob], 'exercise_recording.mp4', { type: 'video/mp4' });
      const result = await analyzeExercise(exerciseType, sets, reps, videoFile);
      
      // Save session data
      const sessionData = {
        exercise: result.exercise,
        sets: [{ reps: result.completed_reps.toString(), weight: '' }],
        duration: '00:01:30', // Placeholder
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      
      onSave(sessionData);
      toast.success('Exercise analyzed successfully!');
    } catch (err) {
      toast.error('Failed to analyze exercise. Please try again.');
    }
  }, [videoBlob, exerciseType, sets, reps, analyzeExercise, onSave]);

  const handleClose = useCallback(() => {
    // Clean up
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    clearAnalysis();
    setVideoBlob(null);
    setExerciseType('');
    setSets(3);
    setReps(10);
    onClose();
  }, [onClose, clearAnalysis]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Record Exercise Session</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Record yourself performing an exercise to get real-time feedback.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exercise-type" className="dark:text-gray-300">Exercise Type</Label>
            <Select value={exerciseType} onValueChange={setExerciseType}>
              <SelectTrigger id="exercise-type" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select exercise" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="squat" className="dark:text-white dark:focus:bg-gray-600">Squat</SelectItem>
                <SelectItem value="deadlift" className="dark:text-white dark:focus:bg-gray-600">Deadlift</SelectItem>
                <SelectItem value="pushup" className="dark:text-white dark:focus:bg-gray-600">Push-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sets" className="dark:text-gray-300">Sets</Label>
              <Input
                id="sets"
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(parseInt(e.target.value) || 1)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reps" className="dark:text-gray-300">Reps</Label>
              <Input
                id="reps"
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(parseInt(e.target.value) || 1)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="dark:text-gray-300">Record Video</Label>
            <div className="border rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center dark:border-gray-600">
              {isRecording ? (
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
              ) : videoBlob ? (
                <video src={URL.createObjectURL(videoBlob)} controls className="w-full h-full object-cover" />
              ) : (
                <div className="text-white text-center">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-70" />
                  <p>Camera preview will appear here</p>
                  <p className="text-sm text-gray-400 mt-1">Click Start Recording</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {!isRecording ? (
                <Button 
                  onClick={startRecording} 
                  className="flex-1 dark:bg-accent dark:hover:bg-accent/90"
                  disabled={isRecording}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
              ) : (
                <Button 
                  onClick={stopRecording} 
                  variant="destructive" 
                  className="flex-1"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              )}
            </div>
          </div>
          
          {analysisResult && (
            <div className="border rounded-lg p-4 bg-muted dark:bg-gray-700 dark:border-gray-600">
              <h3 className="font-semibold mb-2 dark:text-white">Analysis Results</h3>
              <div className="space-y-1 text-sm">
                <p className="dark:text-gray-300">Completed Reps: <span className="font-medium">{analysisResult.completed_reps}</span>/{analysisResult.planned_reps}</p>
                <p className="dark:text-gray-300">Form Score: <span className="font-medium">{analysisResult.form_score}</span>/100</p>
                {analysisResult.mistakes.length > 0 && (
                  <div>
                    <p className="font-medium dark:text-gray-300">Mistakes:</p>
                    <ul className="list-disc pl-5 dark:text-gray-300">
                      {analysisResult.mistakes.map((mistake, index) => (
                        <li key={index}>{mistake.description}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-sm dark:text-red-400">
              Error: {error}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAnalyze} 
            disabled={!videoBlob || !exerciseType || isAnalyzing}
            className="dark:bg-accent dark:hover:bg-accent/90"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze & Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}