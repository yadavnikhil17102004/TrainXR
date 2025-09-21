import mediapipe as mp
from core.mediapipe_wrapper import MediaPipePoseEstimator
from exercises import BaseExerciseCounter
from schemas.exercise import Mistake

class DeadliftCounter(BaseExerciseCounter):
    def __init__(self):
        super().__init__()
        self.mp_pose = mp.solutions.pose
        self.min_angle = 160  # Minimum angle for "up" position
        self.max_angle = 90   # Maximum angle for "down" position
        
    def analyze_frame(self, landmarks):
        """
        Analyze a frame for deadlift form and count reps
        """
        if not landmarks:
            return
            
        # Get key landmarks for deadlift analysis
        # Shoulder, Hip, Knee, Ankle
        shoulder = self.get_landmark(landmarks, self.mp_pose.PoseLandmark.LEFT_SHOULDER)
        hip = self.get_landmark(landmarks, self.mp_pose.PoseLandmark.LEFT_HIP)
        knee = self.get_landmark(landmarks, self.mp_pose.PoseLandmark.LEFT_KNEE)
        ankle = self.get_landmark(landmarks, self.mp_pose.PoseLandmark.LEFT_ANKLE)
        
        # Calculate hip angle
        hip_angle = self.calculate_angle(shoulder, hip, knee)
        
        if hip_angle is None:
            return
            
        # Update rep counter based on angle transitions
        self.update_rep_count(hip_angle)
        
        # Check form feedback
        self.check_form(shoulder, hip, knee, ankle, hip_angle)
        
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
        # If we're going down and reach the bottom of the deadlift
        if self.direction != "down" and angle < self.max_angle:
            self.direction = "down"
            
        # If we're going up and reach the top of the deadlift
        elif self.direction == "down" and angle > self.min_angle:
            self.direction = "up"
            self.rep_count += 1
            
        self.previous_angle = angle
        
    def check_form(self, shoulder, hip, knee, ankle, hip_angle):
        """Check for common form mistakes"""
        # Check back straightness by comparing shoulder-hip and hip-knee angles
        if shoulder and hip and knee and ankle:
            import numpy as np
            
            # Calculate back angle (shoulder to ankle line)
            back_angle = self.calculate_angle(shoulder, hip, ankle)
            
            # Calculate knee angle
            knee_angle = self.calculate_angle(hip, knee, ankle)
            
            # Check if hips are rising faster than shoulders (butt wink)
            if hip_angle and knee_angle:
                if abs(hip_angle - knee_angle) > 30:
                    mistake = Mistake(description="Hips rising too early")
                    if mistake not in self.form_feedback:
                        self.form_feedback.append(mistake)
                        
            # Check if back is straight
            if back_angle and abs(back_angle - 180) > 20:
                mistake = Mistake(description="Back not straight")
                if mistake not in self.form_feedback:
                    self.form_feedback.append(mistake)