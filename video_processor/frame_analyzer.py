import cv2
import numpy as np
from typing import Dict, Any


class FrameAnalyzer:
    """
    Analyzes video frames for exercise form and counting.
    """

    def __init__(self):
        self.mpDraw = None
        self.mpPose = None
        self.pose = None
        self._initialize_pose_model()

    def _initialize_pose_model(self):
        """
        Initialize the MediaPipe pose estimation model.
        """
        import mediapipe as mp
        self.mpDraw = mp.solutions.drawing_utils
        self.mpPose = mp.solutions.pose
        self.pose = self.mpPose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            enable_segmentation=False,
            smooth_segmentation=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def detect_pose(self, img: np.ndarray, draw: bool = True) -> tuple[np.ndarray, Any]:
        """
        Detect pose landmarks in an image.

        Args:
            img (numpy.ndarray): Input image.
            draw (bool): Whether to draw landmarks on the image.

        Returns:
            tuple: (processed_image, results) where results contain pose landmarks.
        """
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = self.pose.process(imgRGB)

        if results.pose_landmarks and draw:
            self.mpDraw.draw_landmarks(img, results.pose_landmarks,
                                       self.mpPose.POSE_CONNECTIONS)

        return img, results

    def extract_landmarks(self, img: np.ndarray, results: Any, draw: bool = True) -> list:
        """
        Extract landmark positions from pose detection results.

        Args:
            img (numpy.ndarray): Input image.
            results (Any): Pose detection results.
            draw (bool): Whether to draw landmark points on the image.

        Returns:
            list: List of landmarks in [id, x, y] format.
        """
        landmarks_list = []
        if results.pose_landmarks:
            for id, lm in enumerate(results.pose_landmarks.landmark):
                h, w, c = img.shape
                cx, cy = int(lm.x * w), int(lm.y * h)
                landmarks_list.append([id, cx, cy])
                if draw:
                    cv2.circle(img, (cx, cy), 5, (255, 0, 0), cv2.FILLED)
        return landmarks_list

    def draw_angle(self, img: np.ndarray, p1: tuple, p2: tuple, p3: tuple, angle: float):
        """
        Draw angle visualization on the image.

        Args:
            img (numpy.ndarray): Input image.
            p1, p2, p3 (tuple): Points defining the angle.
            angle (float): The angle value to display.

        Returns:
            numpy.ndarray: Image with angle visualization.
        """
        # Draw lines
        cv2.line(img, p1, p2, (255, 255, 255), 3)
        cv2.line(img, p3, p2, (255, 255, 255), 3)

        # Draw circles at points
        cv2.circle(img, p1, 10, (0, 0, 255), cv2.FILLED)
        cv2.circle(img, p1, 15, (0, 0, 255), 2)
        cv2.circle(img, p2, 10, (0, 0, 255), cv2.FILLED)
        cv2.circle(img, p2, 15, (0, 0, 255), 2)
        cv2.circle(img, p3, 10, (0, 0, 255), cv2.FILLED)
        cv2.circle(img, p3, 15, (0, 0, 255), 2)

        # Display angle value
        cv2.putText(img, str(int(angle)), (p2[0] - 50, p2[1] + 50),
                    cv2.FONT_HERSHEY_PLAIN, 2, (0, 0, 255), 2)
        return img

    def draw_progress_bar(self, img: np.ndarray, progress_percentage: float, 
                         progress_bar: float, position: tuple = (580, 50)):
        """
        Draw progress bar on the image.

        Args:
            img (numpy.ndarray): Input image.
            progress_percentage (float): Progress percentage (0-100).
            progress_bar (float): Progress bar position.
            position (tuple): Position of the progress bar.

        Returns:
            numpy.ndarray: Image with progress bar.
        """
        x, y = position
        cv2.rectangle(img, (x, y), (x + 20, y + 330), (0, 255, 0), 3)
        cv2.rectangle(img, (x, int(progress_bar)), (x + 20, y + 330), (0, 255, 0), cv2.FILLED)
        cv2.putText(img, f'{int(progress_percentage)}%', (x - 15, y + 380),
                    cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)
        return img

    def draw_counter(self, img: np.ndarray, count: int, position: tuple = (0, 380)):
        """
        Draw exercise counter on the image.

        Args:
            img (numpy.ndarray): Input image.
            count (int): Exercise count.
            position (tuple): Position of the counter.

        Returns:
            numpy.ndarray: Image with counter.
        """
        x, y = position
        cv2.rectangle(img, (x, y), (x + 100, y + 100), (0, 255, 0), cv2.FILLED)
        cv2.putText(img, str(int(count)), (x + 25, y + 75),
                    cv2.FONT_HERSHEY_PLAIN, 5, (255, 0, 0), 5)
        return img

    def draw_feedback(self, img: np.ndarray, feedback: str, position: tuple = (500, 0)):
        """
        Draw exercise feedback on the image.

        Args:
            img (numpy.ndarray): Input image.
            feedback (str): Feedback text.
            position (tuple): Position of the feedback.

        Returns:
            numpy.ndarray: Image with feedback.
        """
        x, y = position
        cv2.rectangle(img, (x, y), (x + 140, y + 40), (255, 255, 255), cv2.FILLED)
        cv2.putText(img, feedback, (x, y + 40),
                    cv2.FONT_HERSHEY_PLAIN, 2, (0, 255, 0), 2)
        return img