"use client";

import { useState, useRef, useCallback } from 'react';

interface CameraConstraints {
  video?: boolean | { facingMode?: string; width?: { ideal: number }; height?: { ideal: number } };
  audio?: boolean;
}

export function useCamera() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const getCameraConstraints = useCallback((): CameraConstraints => {
    // For mobile devices, we want to use the facingMode to switch between front and back cameras
    const constraints: CameraConstraints = {
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    // For Safari on iOS, we might need to use slightly different constraints
    if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
      constraints.video = {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      };
    }

    return constraints;
  }, [facingMode]);

  const startCamera = useCallback(async () => {
    try {
      // Clear any previous errors
      setCameraError(null);
      
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Get camera constraints
      const constraints = getCameraConstraints();
      
      // Request camera access with fallbacks for different browsers
      let stream: MediaStream;
      
      try {
        // Try with ideal constraints first
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (idealError) {
        console.warn('Ideal constraints failed, trying fallback constraints', idealError);
        
        // Fallback to basic constraints
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } catch (basicError) {
          // Last resort: try with specific facingMode
          try {
            stream = await navigator.mediaDevices.getUserMedia({ 
              video: { facingMode: facingMode }, 
              audio: false 
            });
          } catch (finalError) {
            throw new Error(`Camera access denied or not available: ${finalError}`);
          }
        }
      }

      // Set the stream reference
      streamRef.current = stream;
      
      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Add a small delay to ensure the video element updates
        setTimeout(() => {
          if (videoRef.current && videoRef.current.srcObject === stream) {
            videoRef.current.play().catch(err => {
              console.warn('Auto-play prevented:', err);
            });
          }
        }, 100);
      }
      
      setIsCameraActive(true);
      return stream;
    } catch (err) {
      console.error('Camera error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
      setCameraError(errorMessage);
      setIsCameraActive(false);
      throw err;
    }
  }, [getCameraConstraints, facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
    setCameraError(null);
  }, []);

  const switchCamera = useCallback(async () => {
    // Switch between front and back camera
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    // Restart camera with new facing mode
    if (isCameraActive) {
      stopCamera();
      try {
        await startCamera();
      } catch (err) {
        console.error('Failed to switch camera:', err);
      }
    }
  }, [facingMode, isCameraActive, startCamera, stopCamera]);

  const cleanup = useCallback(() => {
    stopCamera();
  }, [stopCamera]);

  return {
    videoRef,
    isCameraActive,
    cameraError,
    facingMode,
    startCamera,
    stopCamera,
    switchCamera,
    cleanup
  };
}