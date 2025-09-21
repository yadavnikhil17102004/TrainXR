import mediapipe as mp
from core.mediapipe_wrapper import MediaPipePoseEstimator
from exercises import BaseExerciseCounter
from schemas.exercise import Mistake

class PushUpCounter(BaseExerciseCounter):
    def __init__(self):
        super().__init__()
        self.mp_pose = mp.solutions.pose
        self.min_angle = 160  # Minimum angle for "up" position
        self.max_angle = 90   # Maximum angle for "down" position
        
    def analyze_frame(self, landmarks):
        """
        Analyze a frame for pushup form and count reps
        """
        if not landmarks:
            return
            
        # Get key landmarks for pushup analysis
        # Shoulder, Elbow, Wrist
        shoulder = self.get_landmark(landmarks, self.mp_pose.PoseLandmark.LEFT_SHOULDER)
        elbow = self.get_landmark(landmarks, self.mp_pose.PoseLandmark.LEFT_ELBOW)
        wrist = self.get_landmark(landmarks, self.mp_pose.PoseLandmark.LEFT_WRIST)
        
        # Calculate elbow angle
        elbow_angle = self.calculate_angle(shoulder, elbow, wrist)
        
        if elbow_angle is None:
            return
            
        # Update rep counter based on angle transitions
        self.update_rep_count(elbow_angle)
        
        # Check form feedback
        self.check_form(shoulder, elbow, wrist, elbow_angle)
        
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
        # If we're going down and reach the bottom of the pushup
        if self.direction != "down" and angle < self.max_angle:
            self.direction = "down"
            
        # If we're going up and reach the top of the pushup
        elif self.direction == "down" and angle > self.min_angle:
            self.direction = "up"
            self.rep_count += 1
            
        self.previous_angle = angle
        
    def check_form(self, shoulder, elbow, wrist, elbow_angle):
        """Check for common form mistakes"""
        # Check elbow alignment (elbows should be at about 45 degrees from body)
        if shoulder and elbow and wrist:
            import numpy as np
            
            # Calculate shoulder-elbow-wrist angle to check elbow flare
            # We want this angle to be around 90 degrees for proper form
            se_vector = np.array(shoulder) - np.array(elbow)
            ew_vector = np.array(wrist) - np.array(elbow)
            
            # Calculate angle between vectors
            cosine_angle = np.dot(se_vector, ew_vector) / (np.linalg.norm(se_vector) * np.linalg.norm(ew_vector))
            se_ew_angle = np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))
            
            # Check if elbows are flaring too much (> 60 degrees from body)
            if abs(se_ew_angle - 90) > 30:
                mistake = Mistake(description="Elbows flaring too much")
                if mistake not in self.form_feedback:
                    self.form_feedback.append(mistake)
                    
            # Check pushup depth
            if elbow_angle > 100:  # Not deep enough
                mistake = Mistake(description="Pushup depth shallow")
                if mistake not in self.form_feedback:
                    self.form_feedback.append(mistake)