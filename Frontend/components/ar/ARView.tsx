"use client";

import { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Scan, AlertTriangle, Info, CheckCircle, Eye } from 'lucide-react';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentExercise = exerciseModels.find(
    (exercise) => exercise.id === selectedExercise
  ) || exerciseModels[0];

  // Check if WebXR is supported
  const [isWebXRSupported, setIsWebXRSupported] = useState(false);
  const [isARSupported, setIsARSupported] = useState(false);
  const [isVRSupported, setIsVRSupported] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.xr) {
      // Check AR support
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setIsARSupported(supported);
      });
      
      // Check VR support
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setIsVRSupported(supported);
      });
      
      // Check if any XR is supported
      Promise.all([
        navigator.xr.isSessionSupported('immersive-ar'),
        navigator.xr.isSessionSupported('immersive-vr')
      ]).then(([arSupported, vrSupported]) => {
        setIsWebXRSupported(arSupported || vrSupported);
      });
    }
  }, []);

  const enterXR = () => {
    // Simple alert for now - in a full implementation, this would initiate WebXR
    alert("WebXR functionality would be implemented here. This requires a browser that supports WebXR (like Chrome on Android or Safari on iOS) and compatible hardware.");
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b border-border dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold">Exercise Assistant</h2>
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
            
            {/* Always show the button but provide feedback when not supported */}
            <Button 
              onClick={enterXR}
              className="bg-accent hover:bg-accent/90 dark:bg-accent dark:hover:bg-accent/90"
            >
              <Eye className="h-4 w-4 mr-2" />
              Enter XR
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <Canvas 
          ref={canvasRef}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <CanvasContent currentExercise={currentExercise} />
          </Suspense>
        </Canvas>
        
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <Card className="p-4 max-w-md mx-4 bg-background dark:bg-gray-800 border-input dark:border-gray-700 shadow-lg">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-lg">3D Exercise Viewer</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Interactive exercise demonstration
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-muted-foreground mb-3 dark:text-gray-400">
                Use your mouse or touch to rotate and zoom the 3D model.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                <div className="flex items-start">
                  <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">XR Information</h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Click "Enter XR" to experience this model in augmented/virtual reality. 
                      {isWebXRSupported ? " Your device supports XR!" : " Requires WebXR support."}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>3D exercise visualization</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Interactive model controls</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Realistic animations</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground dark:text-gray-400 mt-3">
                Current exercise: {currentExercise.name}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}