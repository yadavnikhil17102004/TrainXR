"""
Live camera demo for the TrainXR exercise counter system.
"""

import cv2
import time
from exercises.squat_counter import SquatCounter
from exercises.pushup_counter import PushupCounter
from exercises.deadlift_counter import DeadliftCounter
from exercises.pullup_counter import PullupCounter
from exercises.bicep_curl_counter import BicepCurlCounter


def live_camera_demo():
    """
    Live camera demo showing real-time exercise counting.
    """
    print("TrainXR Live Camera Demo")
    print("=" * 30)
    print("Select exercise to track:")
    print("1. Squats")
    print("2. Pushups")
    print("3. Deadlifts")
    print("4. Pullups")
    print("5. Bicep Curls")
    
    choice = input("Enter choice (1-5): ")
    
    # Initialize appropriate counter based on user choice
    if choice == "1":
        counter = SquatCounter()
        exercise_name = "Squats"
    elif choice == "2":
        counter = PushupCounter()
        exercise_name = "Pushups"
    elif choice == "3":
        counter = DeadliftCounter()
        exercise_name = "Deadlifts"
    elif choice == "4":
        counter = PullupCounter()
        exercise_name = "Pullups"
    elif choice == "5":
        counter = BicepCurlCounter()
        exercise_name = "Bicep Curls"
    else:
        print("Invalid choice. Defaulting to Squats.")
        counter = SquatCounter()
        exercise_name = "Squats"
    
    print(f"\nTracking {exercise_name}...")
    print("Press 'q' to quit the demo.")
    time.sleep(2)
    
    # Open webcam
    video_capture = cv2.VideoCapture(0)
    
    if not video_capture.isOpened():
        print("Error: Could not open webcam.")
        return
    
    print("Webcam opened successfully. Starting exercise tracking...")
    
    try:
        while True:
            success, frame = video_capture.read()
            if not success:
                print("Error: Could not read frame from webcam.")
                break
            
            # Process frame
            result = counter.count(frame)
            
            # Display results on frame
            cv2.putText(frame, f"Exercise: {exercise_name}", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, f"Count: {result['count']}", (10, 70),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, f"Feedback: {result['feedback']}", (10, 110),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
            # Show frame
            cv2.imshow('TrainXR Live Exercise Tracker', frame)
            
            # Break loop on 'q' key press
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
    except KeyboardInterrupt:
        print("\nDemo interrupted by user.")
    except Exception as e:
        print(f"Error during demo: {e}")
    finally:
        # Clean up
        video_capture.release()
        cv2.destroyAllWindows()
        print("Demo finished. Resources released.")


if __name__ == "__main__":
    live_camera_demo()