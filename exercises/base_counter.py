import cv2
import mediapipe as mp
import numpy as np
from abc import ABC, abstractmethod


class BaseCounter(ABC):
    """
    Abstract base class for all exercise counters.
    """

    def __init__(self):
        self.counter = 0
        self.movement_dir = 0  # 0 for down, 1 for up
        self.correct_form = 0  # 0 for incorrect, 1 for correct
        self.exercise_feedback = "Fix Form"
        self.pose_detector = None
        self._initialize_pose_detector()

    def _initialize_pose_detector(self):
        """
        Initialize the pose detector.
        """
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

    def findPose(self, img, draw=True):
        """
        Find the pose landmarks in an image or video frame.

        Args:
            img (numpy.ndarray): The input image or video frame.
            draw (bool): Whether to draw the pose landmarks on the image or not.

        Returns:
            The input image or video frame with or without the drawn pose landmarks.
        """
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.pose.process(imgRGB)

        if self.results.pose_landmarks:
            if draw:
                self.mpDraw.draw_landmarks(img, self.results.pose_landmarks,
                                           self.mpPose.POSE_CONNECTIONS)

        return img

    def findPosition(self, img, draw=True):
        """
        Find the pose landmark positions in an image or video frame.

        Args:
            img (numpy.ndarray): The input image or video frame.
            draw (bool): Whether to draw the pose landmark positions on the image or not.

        Returns:
            A list containing the landmark ID, X and Y positions for each landmark in the pose.
        """
        landmarks_list = []
        if self.results.pose_landmarks:
            for id, lm in enumerate(self.results.pose_landmarks.landmark):
                h, w, c = img.shape
                cx, cy = int(lm.x * w), int(lm.y * h)
                landmarks_list.append([id, cx, cy])
                if draw:
                    cv2.circle(img, (cx, cy), 5, (255, 0, 0), cv2.FILLED)
        return landmarks_list

    def findAngle(self, img, p1, p2, p3, landmarks_list, draw=True):
        """
        Calculate the angle between three landmarks in an image or video frame.

        Args:
            img (numpy.ndarray): The input image or video frame.
            p1 (int): The index of the first landmark.
            p2 (int): The index of the second landmark.
            p3 (int): The index of the third landmark.
            landmarks_list (list): The list of pose landmark positions in the frame.
            draw (bool): Whether to draw the angle and lines on the image or not.

        Returns:
            The angle between the three landmarks in degrees.
        """
        # Get the coordinates
        x1, y1 = landmarks_list[p1][1:]
        x2, y2 = landmarks_list[p2][1:]
        x3, y3 = landmarks_list[p3][1:]

        # Calculate the angle
        angle = np.degrees(np.arctan2(y3 - y2, x3 - x2) - np.arctan2(y1 - y2, x1 - x2))
        if angle < 0:
            angle += 360

        if draw:
            cv2.line(img, (x1, y1), (x2, y2), (255, 255, 255), 3)
            cv2.line(img, (x3, y3), (x2, y2), (255, 255, 255), 3)
            cv2.circle(img, (x1, y1), 10, (0, 0, 255), cv2.FILLED)
            cv2.circle(img, (x1, y1), 15, (0, 0, 255), 2)
            cv2.circle(img, (x2, y2), 10, (0, 0, 255), cv2.FILLED)
            cv2.circle(img, (x2, y2), 15, (0, 0, 255), 2)
            cv2.circle(img, (x3, y3), 10, (0, 0, 255), cv2.FILLED)
            cv2.circle(img, (x3, y3), 15, (0, 0, 255), 2)
            cv2.putText(img, str(int(angle)), (x2 - 50, y2 + 50),
                        cv2.FONT_HERSHEY_PLAIN, 2, (0, 0, 255), 2)

        return angle

    @abstractmethod
    def count(self, img):
        """
        Count exercise repetitions in the given image/frame.
        This method must be implemented by all subclasses.

        Args:
            img (numpy.ndarray): The input image or video frame.

        Returns:
            dict: A dictionary containing the count and feedback.
        """
        pass

    def process_video(self, video_path):
        """
        Process a video file and count exercises.

        Args:
            video_path (str): Path to the video file.

        Returns:
            dict: A dictionary containing the final count and feedback.
        """
        video_capture = cv2.VideoCapture(video_path)
        frame_delay = int(1000 / video_capture.get(cv2.CAP_PROP_FPS))

        while video_capture.isOpened():
            success, frame = video_capture.read()
            if not success:
                break

            result = self.count(frame)
            # In a real implementation, you might want to aggregate results
            # or show the frame with overlay

            if cv2.waitKey(frame_delay) & 0xFF == ord('q'):
                break

        video_capture.release()
        cv2.destroyAllWindows()
        return result

    def process_live_video(self):
        """
        Process live video from webcam and count exercises.

        Returns:
            dict: A dictionary containing the final count and feedback.
        """
        video_capture = cv2.VideoCapture(0)

        while video_capture.isOpened():
            success, frame = video_capture.read()
            if not success:
                break

            result = self.count(frame)
            # In a real implementation, you might want to show the frame with overlay

            if cv2.waitKey(10) & 0xFF == ord('q'):
                break

        video_capture.release()
        cv2.destroyAllWindows()
        return result