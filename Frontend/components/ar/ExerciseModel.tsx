"use client";

import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ExerciseModelProps {
  url: string;
}

export function ExerciseModel({ url }: ExerciseModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, groupRef);
  
  const [isAnimating, setIsAnimating] = useState(true);

  // Play all animations
  useEffect(() => {
    if (actions && isAnimating) {
      // Play all animations
      Object.values(actions).forEach((action) => {
        if (action) {
          action.play();
        }
      });
    }
    
    // Cleanup function
    return () => {
      if (actions) {
        Object.values(actions).forEach((action) => {
          if (action) {
            action.stop();
          }
        });
      }
    };
  }, [actions, isAnimating]);

  // Update animations
  useFrame((state, delta) => {
    if (actions && isAnimating) {
      // Update all active actions
      Object.values(actions).forEach((action) => {
        if (action) {
          action.time += delta;
        }
      });
    }
  });

  return (
    <group ref={groupRef} scale={[1.5, 1.5, 1.5]} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}