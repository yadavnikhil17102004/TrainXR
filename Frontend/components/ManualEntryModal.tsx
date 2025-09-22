"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sessionData: any) => void;
}

export function ManualEntryModal({ isOpen, onClose, onSave }: ManualEntryModalProps) {
  const [exerciseType, setExerciseType] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!exerciseType) {
      toast.error('Please select an exercise type.');
      return;
    }

    const sessionData = {
      exercise: exerciseType,
      sets: Array.from({ length: sets }, (_, i) => ({
        set: i + 1,
        reps: reps.toString(),
        weight: weight || '0',
      })),
      duration: duration || '00:00:00',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      notes,
    };

    onSave(sessionData);
    toast.success('Exercise data saved successfully!');
    
    // Reset form
    setExerciseType('');
    setSets(3);
    setReps(10);
    setWeight('');
    setDuration('');
    setNotes('');
  };

  const handleClose = () => {
    // Reset form
    setExerciseType('');
    setSets(3);
    setReps(10);
    setWeight('');
    setDuration('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Manual Exercise Entry - TrainXR</DialogTitle>
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
                <SelectItem value="pullup" className="dark:text-white dark:focus:bg-gray-600">Pull-up</SelectItem>
                <SelectItem value="bicep_curl" className="dark:text-white dark:focus:bg-gray-600">Bicep Curl</SelectItem>
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
              <Label htmlFor="reps" className="dark:text-gray-300">Reps per Set</Label>
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
            <Label htmlFor="weight" className="dark:text-gray-300">Weight (kg/lbs)</Label>
            <Input
              id="weight"
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 50kg or 120lbs"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration" className="dark:text-gray-300">Duration (optional)</Label>
            <Input
              id="duration"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 00:30:00"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="dark:text-gray-300">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did you feel? Any observations?"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
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
            onClick={handleSave}
            className="dark:bg-accent dark:hover:bg-accent/90"
          >
            Save Exercise
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}