import cv2
import os
from typing import Generator, Optional


class VideoHandler:
    """
    Handles video input/output operations.
    """

    def __init__(self):
        self.video_capture = None

    def open_video_file(self, video_path: str) -> bool:
        """
        Open a video file for processing.

        Args:
            video_path (str): Path to the video file.

        Returns:
            bool: True if video was opened successfully, False otherwise.
        """
        if not os.path.exists(video_path):
            return False

        self.video_capture = cv2.VideoCapture(video_path)
        return self.video_capture.isOpened()

    def open_webcam(self, camera_index: int = 0) -> bool:
        """
        Open webcam for live video processing.

        Args:
            camera_index (int): Index of the camera to use (default: 0).

        Returns:
            bool: True if webcam was opened successfully, False otherwise.
        """
        self.video_capture = cv2.VideoCapture(camera_index)
        return self.video_capture.isOpened()

    def get_frame(self) -> Optional[tuple[bool, object]]:
        """
        Read a frame from the video source.

        Returns:
            tuple: (success, frame) where success is a boolean indicating
                   if frame was read successfully, and frame is the image data.
        """
        if self.video_capture is None:
            return False, None

        return self.video_capture.read()

    def get_frame_rate(self) -> float:
        """
        Get the frame rate of the video.

        Returns:
            float: Frame rate in frames per second.
        """
        if self.video_capture is None:
            return 0.0

        return self.video_capture.get(cv2.CAP_PROP_FPS)

    def get_frame_delay(self) -> int:
        """
        Get the delay between frames in milliseconds.

        Returns:
            int: Delay in milliseconds.
        """
        fps = self.get_frame_rate()
        if fps > 0:
            return int(1000 / fps)
        return 30  # Default delay

    def get_video_dimensions(self) -> tuple[int, int]:
        """
        Get the dimensions of the video.

        Returns:
            tuple: (width, height) of the video.
        """
        if self.video_capture is None:
            return (0, 0)

        width = int(self.video_capture.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(self.video_capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
        return (width, height)

    def release(self):
        """
        Release the video capture resources.
        """
        if self.video_capture is not None:
            self.video_capture.release()
            self.video_capture = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.release()


def process_video_frames(video_path: str) -> Generator[tuple[object, int, int], None, None]:
    """
    Generator that yields frames from a video file.

    Args:
        video_path (str): Path to the video file.

    Yields:
        tuple: (frame, frame_number, total_frames)
    """
    with VideoHandler() as handler:
        if not handler.open_video_file(video_path):
            raise ValueError(f"Could not open video file: {video_path}")

        total_frames = int(handler.video_capture.get(cv2.CAP_PROP_FRAME_COUNT))
        frame_number = 0

        while True:
            success, frame = handler.get_frame()
            if not success:
                break

            frame_number += 1
            yield frame, frame_number, total_frames


def process_webcam_frames() -> Generator[object, None, None]:
    """
    Generator that yields frames from the webcam.

    Yields:
        object: Frame from the webcam
    """
    with VideoHandler() as handler:
        if not handler.open_webcam():
            raise ValueError("Could not open webcam")

        while True:
            success, frame = handler.get_frame()
            if not success:
                break

            yield frame