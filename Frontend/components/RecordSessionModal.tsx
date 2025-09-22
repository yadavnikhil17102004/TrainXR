"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useExerciseAnalysis } from '../Hooks/useExerciseAnalysis';
import { useCamera } from '../Hooks/useCamera';
import { toast } from 'sonner';
import { Camera, Video, Square, RotateCcw } from 'lucide-react';

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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  const { analyzeExercise, isAnalyzing, analysisResult, error, clearAnalysis } = useExerciseAnalysis();
  const { 
    videoRef, 
    isCameraActive, 
    cameraError, 
    facingMode, 
    startCamera, 
    stopCamera, 
    switchCamera,
    cleanup: cleanupCamera 
  } = useCamera();

  // Clean up camera when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      cleanupCamera();
    }
  }, [isOpen, stopCamera, cleanupCamera]);

  const startRecording = useCallback(async () => {
    try {
      console.log("Starting camera...");
      // Start camera
      const stream = await startCamera();
      console.log("Camera started, stream:", stream);
      
      // Initialize MediaRecorder with cross-browser compatible options
      const options = { mimeType: 'video/webm;codecs=vp9' };
      
      // Check if the preferred mimeType is supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        // Try alternative codecs
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
          options.mimeType = 'video/webm;codecs=vp8';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          options.mimeType = 'video/webm';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          options.mimeType = 'video/mp4';
        } else {
          // Fallback to default
          options.mimeType = '';
        }
      }
      
      // Create MediaRecorder with selected options
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];
      
      // Set up event listeners
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      console.log("Recording started");
    } catch (err) {
      console.error('Recording error:', err);
      toast.error(cameraError || 'Camera not available. Try the Upload Video button instead.');
    }
  }, [startCamera, cameraError]);

  const stopRecording = useCallback(() => {
    console.log("Stopping recording...");
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    stopCamera();
    setIsRecording(false);
    console.log("Recording stopped");
  }, [isRecording, stopCamera]);

  const handleAnalyze = useCallback(async () => {
    if (!exerciseType) {
      toast.error('Please select an exercise type.');
      return;
    }
    
    if (!videoBlob) {
      toast.error('Please record a video first.');
      return;
    }
    
    try {
      // Create a video file for analysis
      const videoFile = new File([videoBlob], 'exercise_recording.webm', { type: 'video/webm' });
      
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
  }, [exerciseType, sets, reps, videoBlob, analyzeExercise, onSave]);

  const handleClose = useCallback(() => {
    // Clean up
    stopRecording();
    cleanupCamera();
    clearAnalysis();
    setVideoBlob(null);
    setExerciseType('');
    setSets(3);
    setReps(10);
    onClose();
  }, [onClose, stopRecording, cleanupCamera, clearAnalysis]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Record Exercise Session - TrainXR</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Record yourself performing an exercise to get real-time feedback.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm dark:bg-blue-900/20 dark:border-blue-800">
            <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">Camera Access</div>
            <p className="text-blue-700 dark:text-blue-300">
              Click "Start Recording" to access your camera. If it doesn't work, try the "Upload Video" button.
            </p>
          </div>
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
              {isCameraActive ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                  onPlay={() => console.log("Video is playing")}
                  onError={(e) => console.error("Video error:", e)}
                />
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
              {isCameraActive && (
                <Button 
                  onClick={switchCamera}
                  variant="outline"
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Flip Camera
                </Button>
              )}
              <Button 
                variant="outline" 
                className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                onClick={() => document.getElementById('video-upload')?.click()}
              >
                <Video className="mr-2 h-4 w-4" />
                Upload Video
              </Button>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setVideoBlob(file);
                    toast.success('Video uploaded successfully!');
                  }
                }}
              />
            </div>
            
            {cameraError && (
              <div className="text-red-500 text-sm dark:text-red-400">
                Camera Error: {cameraError}
              </div>
            )}
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