import cv2
import numpy as np
from exercises.base_counter import BaseCounter


class PullupCounter(BaseCounter):
    """
    Exercise counter for pullups.
    """

    def __init__(self):
        super().__init__()

    def count(self, img):
        """
        Count pullup repetitions in the given image/frame.

        Args:
            img (numpy.ndarray): The input image or video frame.

        Returns:
            dict: A dictionary containing the count and feedback.
        """
        # Reset values for each frame
        self.correct_form = 0
        self.exercise_feedback = "Fix Form"

        # Find pose and positions
        img = self.findPose(img, False)
        landmarks_list = self.findPosition(img, False)

        if len(landmarks_list) != 0:
            # Calculate angles for pullup
            # Using shoulder, elbow, and wrist for pullup form
            elbow_angle = self.findAngle(img, 12, 14, 16, landmarks_list, False)
            shoulder_angle = self.findAngle(img, 14, 12, 24, landmarks_list, False)

            # Calculate progress
            progress_percentage = np.interp(elbow_angle, (40, 160), (0, 100))
            progress_bar = np.interp(elbow_angle, (40, 160), (380, 50))

            # Check if form is correct
            if elbow_angle > 150 and shoulder_angle > 40:
                self.correct_form = 1

            if self.correct_form == 1:
                if progress_percentage == 0:
                    if elbow_angle <= 40:
                        self.exercise_feedback = "Down"
                        if self.movement_dir == 0:
                            self.counter += 0.5
                            self.movement_dir = 1
                    else:
                        self.exercise_feedback = "Fix Form"

                if progress_percentage == 100:
                    if elbow_angle > 150:
                        self.exercise_feedback = "Up"
                        if self.movement_dir == 1:
                            self.counter += 0.5
                            self.movement_dir = 0
                    else:
                        self.exercise_feedback = "Fix Form"

            # Add visual feedback to image
            if self.correct_form == 1:
                # Progress bar
                cv2.rectangle(img, (580, 50), (600, 380), (0, 255, 0), 3)
                cv2.rectangle(img, (580, int(progress_bar)), (600, 380), (0, 255, 0), cv2.FILLED)
                cv2.putText(img, f'{int(progress_percentage)}%', (565, 430),
                            cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)

            # Counter display
            cv2.rectangle(img, (0, 380), (100, 480), (0, 255, 0), cv2.FILLED)
            cv2.putText(img, str(int(self.counter)), (25, 455),
                        cv2.FONT_HERSHEY_PLAIN, 5, (255, 0, 0), 5)

            # Feedback display
            cv2.rectangle(img, (500, 0), (640, 40), (255, 255, 255), cv2.FILLED)
            cv2.putText(img, self.exercise_feedback, (500, 40),
                        cv2.FONT_HERSHEY_PLAIN, 2, (0, 255, 0), 2)

        return {
            "exercise": "Pullups",
            "count": int(self.counter),
            "feedback": self.exercise_feedback,
            "form_correct": bool(self.correct_form)
        }