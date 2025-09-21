import mediapipe as mp
from core.mediapipe_wrapper import MediaPipePoseEstimator
from exercises import BaseExerciseCounter
from schemas.exercise import Mistake

class SquatCounter(BaseExerciseCounter):
    def __init__(self):
        super().__init__()
        self.mp_pose = mp.solutions.pose
        self.min_angle = 160  # Minimum angle for "up" position
        self.max_angle = 90   # Maximum angle for "down" position
        
    def analyze_frame(self, landmarks):
        """
        Analyze a frame for squat form and count reps
        """
        if not landmarks:
            return
            
        # Get key landmarks for squat analysis
        # Hip (shoulder), Knee, Ankle
        hip = self.get_landmark(landmarks, self.mp_pose.PoseLandmark.LEFT_HIP)
        knee = self.get_landmark(landmarks, self.mp_pose.PoseLandmark.LEFT_KNEE)
        ankle = self.get_landmark(landmarks, self.mp_pose.PoseLandmark.LEFT_ANKLE)
        
        # Calculate knee angle
        angle = self.calculate_angle(hip, knee, ankle)
        
        if angle is None:
            return
            
        # Update rep counter based on angle transitions
        self.update_rep_count(angle)
        
        # Check form feedback
        self.check_form(hip, knee, ankle, angle)
        
    def get_landmark(self, landmarks, landmark_type):
        """Extract coordinates for a specific landmark"""
        if landmarks and hasattr(landmarks, 'landmark'):
            landmark = landmarks.landmark[landmark_type]
            return [landmark.x, landmark.y]
        return None
        
    def calculate_angle(self, a, b, c):
        """Calculate angle between three points"""
        if a is None or b is None or c is None:
            return None
            
        import numpy as np
        
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
        
    def update_rep_count(self, angle):
        """Update rep count based on angle transitions"""
        # If we're going down and reach the bottom of the squat
        if self.direction != "down" and angle < self.max_angle:
            self.direction = "down"
            
        # If we're going up and reach the top of the squat
        elif self.direction == "down" and angle > self.min_angle:
            self.direction = "up"
            self.rep_count += 1
            
        self.previous_angle = angle
        
    def check_form(self, hip, knee, ankle, angle):
        """Check for common form mistakes"""
        # Check squat depth
        if angle > 100:  # Not deep enough
            mistake = Mistake(description="Squat depth shallow")
            if mistake not in self.form_feedback:
                self.form_feedback.append(mistake)
                
        # Check knee alignment (knee should be aligned with ankle)
        if knee and ankle:
            import numpy as np
            knee_ankle_dist = np.linalg.norm(np.array(knee) - np.array(ankle))
            if knee_ankle_dist > 0.3:  # Knee too far forward/back
                mistake = Mistake(description="Knee not aligned with ankle")
                if mistake not in self.form_feedback:
                    self.form_feedback.append(mistake)