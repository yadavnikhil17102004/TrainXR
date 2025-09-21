import cv2
import mediapipe as mp
import numpy as np
from typing import List, Tuple

class MediaPipePoseEstimator:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.mp_draw = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            enable_segmentation=False,
            min_detection_confidence=0.5
        )
        
    def process_frame(self, frame: np.ndarray) -> Tuple[np.ndarray, List]:
        """
        Process a video frame and extract pose landmarks
        Returns the annotated frame and list of landmarks
        """
        # Convert the BGR image to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process the frame with MediaPipe
        results = self.pose.process(rgb_frame)
        
        # Draw pose landmarks on the frame
        if results.pose_landmarks:
            self.mp_draw.draw_landmarks(
                frame, 
                results.pose_landmarks, 
                self.mp_pose.POSE_CONNECTIONS
            )
            
        return frame, results.pose_landmarks
    
    def get_landmark_coordinates(self, landmarks, landmark_type):
        """
        Extract coordinates for a specific landmark
        """
        if landmarks and hasattr(landmarks, 'landmark'):
            landmark = landmarks.landmark[landmark_type]
            return [landmark.x, landmark.y, landmark.z]
        return None
        
    def calculate_angle(self, a, b, c):
        """
        Calculate angle between three points
        """
        if a is None or b is None or c is None:
            return None
            
        # Convert to numpy arrays
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)
        
        # Calculate vectors
        ba = a - b
        bc = c - b
        
        # Calculate cosine of angle
        cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
        angle = np.arccos(np.clip(cosine_angle, -1.0, 1.0))
        
        # Convert to degrees
        return np.degrees(angle)