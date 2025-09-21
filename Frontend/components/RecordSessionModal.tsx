"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useExerciseAnalysis } from '../Hooks/useExerciseAnalysis';
import { toast } from 'sonner';

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
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Exercise Session</DialogTitle>
          <DialogDescription>
            Record yourself performing an exercise to get real-time feedback.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exercise-type">Exercise Type</Label>
            <Select value={exerciseType} onValueChange={setExerciseType}>
              <SelectTrigger id="exercise-type">
                <SelectValue placeholder="Select exercise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="squat">Squat</SelectItem>
                <SelectItem value="deadlift">Deadlift</SelectItem>
                <SelectItem value="pushup">Push-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sets">Sets</Label>
              <Input
                id="sets"
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reps">Reps</Label>
              <Input
                id="reps"
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Record Video</Label>
            <div className="border rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
              {isRecording ? (
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
              ) : videoBlob ? (
                <video src={URL.createObjectURL(videoBlob)} controls className="w-full h-full object-cover" />
              ) : (
                <div className="text-white text-center">
                  <p>Camera preview will appear here</p>
                  <p className="text-sm text-gray-400 mt-1">Click Start Recording</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {!isRecording ? (
                <Button onClick={startRecording} className="flex-1">
                  Start Recording
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="destructive" className="flex-1">
                  Stop Recording
                </Button>
              )}
            </div>
          </div>
          
          {analysisResult && (
            <div className="border rounded-lg p-4 bg-muted">
              <h3 className="font-semibold mb-2">Analysis Results</h3>
              <div className="space-y-1 text-sm">
                <p>Completed Reps: {analysisResult.completed_reps}/{analysisResult.planned_reps}</p>
                <p>Form Score: {analysisResult.form_score}/100</p>
                {analysisResult.mistakes.length > 0 && (
                  <div>
                    <p>Mistakes:</p>
                    <ul className="list-disc pl-5">
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
            <div className="text-red-500 text-sm">
              Error: {error}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleAnalyze} 
            disabled={!videoBlob || !exerciseType || isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze & Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}