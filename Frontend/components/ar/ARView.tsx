"use client";

import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExerciseModel } from './ExerciseModel';

const exerciseModels = [
  { id: 'squat', name: 'Squat', file: '/models/squat.glb' },
  { id: 'pushup', name: 'Push-up', file: '/models/pushup.glb' },
  { id: 'plank', name: 'Plank', file: '/models/plank.glb' },
];

function CanvasContent({ currentExercise }: { currentExercise: typeof exerciseModels[0] }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="city" />
      
      <ExerciseModel url={currentExercise.file} />
      
      <ContactShadows 
        position={[0, -0.8, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={1.5} 
        far={0.8} 
      />
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2} 
      />
    </>
  );
}

export function ARView() {
  const [selectedExercise, setSelectedExercise] = useState(exerciseModels[0].id);

  const currentExercise = exerciseModels.find(
    (exercise) => exercise.id === selectedExercise
  ) || exerciseModels[0];

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b border-border dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold">AR Exercise Assistant</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background dark:bg-gray-800 border-input dark:border-gray-700">
                <SelectValue placeholder="Select exercise" />
              </SelectTrigger>
              <SelectContent className="bg-background dark:bg-gray-800 border-input dark:border-gray-700">
                {exerciseModels.map((exercise) => (
                  <SelectItem 
                    key={exercise.id} 
                    value={exercise.id}
                    className="focus:bg-accent focus:text-accent-foreground dark:focus:bg-gray-700"
                  >
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative bg-gray-100 dark:bg-gray-900">
        <Canvas className="w-full h-full">
          <Suspense fallback={null}>
            <CanvasContent currentExercise={currentExercise} />
          </Suspense>
        </Canvas>
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <Card className="p-4 max-w-md mx-4 bg-background dark:bg-gray-800 border-input dark:border-gray-700">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-lg">AR Mode</CardTitle>
              <CardDescription className="dark:text-gray-400">
                View in augmented reality
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground mb-3 dark:text-gray-400">
                To view this 3D model in AR, use a WebXR-compatible browser on a supported device.
              </p>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                Current exercise: {currentExercise.name}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}