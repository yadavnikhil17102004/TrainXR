from typing import List
from schemas.exercise import Mistake

class BaseExerciseCounter:
    def __init__(self):
        self.rep_count = 0
        self.form_feedback: List[Mistake] = []
        self.previous_angle = None
        self.direction = None  # "up" or "down"
        self.planned_reps = 0
        
    def analyze_frame(self, landmarks):
        """
        Analyze a single frame and update rep count and form feedback
        This method should be overridden by specific exercise implementations
        """
        raise NotImplementedError("This method should be implemented by subclasses")
        
    def get_completed_reps(self):
        return self.rep_count
        
    def get_form_feedback(self):
        return self.form_feedback
        
    def reset(self):
        self.rep_count = 0
        self.form_feedback = []
        self.previous_angle = None
        self.direction = None