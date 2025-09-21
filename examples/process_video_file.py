"""
Example usage of the TrainXR exercise counter system.
"""

import cv2
from exercises.squat_counter import SquatCounter
from exercises.pushup_counter import PushupCounter
from exercises.deadlift_counter import DeadliftCounter
from exercises.pullup_counter import PullupCounter
from exercises.bicep_curl_counter import BicepCurlCounter


def process_video_example():
    """
    Example of processing a video file with exercise counting.
    """
    print("Processing video file example...")
    
    # Initialize counter (change this to test different exercises)
    counter = SquatCounter()  # or PushupCounter(), DeadliftCounter(), etc.
    
    # Process video file
    video_path = "./videos/squats.mp4"  # Update with your video path
    
    try:
        result = counter.process_video(video_path)
        print(f"Exercise: {result['exercise']}")
        print(f"Count: {result['count']}")
        print(f"Feedback: {result['feedback']}")
        print(f"Form correct: {result['form_correct']}")
    except Exception as e:
        print(f"Error processing video: {e}")


def live_video_example():
    """
    Example of processing live video from webcam.
    """
    print("Live video processing example...")
    
    # Initialize counter (change this to test different exercises)
    counter = PushupCounter()  # or SquatCounter(), DeadliftCounter(), etc.
    
    try:
        result = counter.process_live_video()
        print(f"Exercise: {result['exercise']}")
        print(f"Count: {result['count']}")
        print(f"Feedback: {result['feedback']}")
        print(f"Form correct: {result['form_correct']}")
    except Exception as e:
        print(f"Error processing live video: {e}")


def frame_by_frame_example():
    """
    Example of processing video frame by frame for more control.
    """
    print("Frame-by-frame processing example...")
    
    # Initialize counter
    counter = SquatCounter()
    
    # Open video file
    video_capture = cv2.VideoCapture("./videos/squats.mp4")  # Update with your video path
    frame_count = 0
    
    while video_capture.isOpened():
        success, frame = video_capture.read()
        if not success:
            break
            
        frame_count += 1
        
        # Process every 5th frame to reduce computation
        if frame_count % 5 == 0:
            result = counter.count(frame)
            print(f"Frame {frame_count}: Count = {result['count']}, Feedback = {result['feedback']}")
        
        # Display frame (optional)
        cv2.imshow('Exercise Counter', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    video_capture.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    print("TrainXR Exercise Counter Examples")
    print("=" * 40)
    
    # Uncomment the example you want to run:
    # process_video_example()
    # live_video_example()
    # frame_by_frame_example()
    
    print("Examples complete!")