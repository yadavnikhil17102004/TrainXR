import numpy as np


def calculate_angle(p1, p2, p3):
    """
    Calculate the angle between three points.

    Args:
        p1, p2, p3 (tuple): Points represented as (x, y) coordinates.

    Returns:
        float: The angle in degrees between the three points.
    """
    # Calculate the angle
    angle = np.degrees(np.arctan2(p3[1] - p2[1], p3[0] - p2[0]) - 
                       np.arctan2(p1[1] - p2[1], p1[0] - p2[0]))
    if angle < 0:
        angle += 360
    return angle


def get_landmark_coords(landmarks_list, landmark_id):
    """
    Get the coordinates of a specific landmark.

    Args:
        landmarks_list (list): List of landmarks with [id, x, y] format.
        landmark_id (int): The ID of the landmark to retrieve.

    Returns:
        tuple: The (x, y) coordinates of the landmark, or None if not found.
    """
    if landmark_id < len(landmarks_list):
        return (landmarks_list[landmark_id][1], landmarks_list[landmark_id][2])
    return None


def calculate_exercise_metrics(landmarks_list, exercise_type):
    """
    Calculate exercise-specific metrics based on landmarks.

    Args:
        landmarks_list (list): List of landmarks with [id, x, y] format.
        exercise_type (str): Type of exercise to calculate metrics for.

    Returns:
        dict: Dictionary containing exercise-specific metrics.
    """
    metrics = {}
    
    if exercise_type.lower() == "squat":
        # Calculate knee and hip angles for squats
        knee_coords = [get_landmark_coords(landmarks_list, i) for i in [24, 26, 28]]
        hip_coords = [get_landmark_coords(landmarks_list, i) for i in [12, 24, 26]]
        
        if all(knee_coords) and all(hip_coords):
            metrics["knee_angle"] = calculate_angle(*knee_coords)
            metrics["hip_angle"] = calculate_angle(*hip_coords)
            metrics["progress"] = np.interp(metrics["knee_angle"], (115, 140), (0, 100))
            
    elif exercise_type.lower() == "pushup":
        # Calculate elbow, shoulder, and hip angles for pushups
        elbow_coords = [get_landmark_coords(landmarks_list, i) for i in [11, 13, 15]]
        shoulder_coords = [get_landmark_coords(landmarks_list, i) for i in [13, 11, 23]]
        hip_coords = [get_landmark_coords(landmarks_list, i) for i in [11, 23, 25]]
        
        if all(elbow_coords) and all(shoulder_coords) and all(hip_coords):
            metrics["elbow_angle"] = calculate_angle(*elbow_coords)
            metrics["shoulder_angle"] = calculate_angle(*shoulder_coords)
            metrics["hip_angle"] = calculate_angle(*hip_coords)
            metrics["progress"] = np.interp(metrics["elbow_angle"], (90, 150), (0, 100))
            
    elif exercise_type.lower() == "deadlift":
        # Calculate hip, knee, and shoulder angles for deadlifts
        hip_coords = [get_landmark_coords(landmarks_list, i) for i in [11, 23, 25]]
        knee_coords = [get_landmark_coords(landmarks_list, i) for i in [23, 25, 27]]
        shoulder_coords = [get_landmark_coords(landmarks_list, i) for i in [11, 13, 15]]
        
        if all(hip_coords) and all(knee_coords) and all(shoulder_coords):
            metrics["hip_angle"] = calculate_angle(*hip_coords)
            metrics["knee_angle"] = calculate_angle(*knee_coords)
            metrics["shoulder_angle"] = calculate_angle(*shoulder_coords)
            metrics["progress"] = np.interp(metrics["hip_angle"], (160, 180), (0, 100))
            
    elif exercise_type.lower() == "pullup":
        # Calculate elbow and shoulder angles for pullups
        elbow_coords = [get_landmark_coords(landmarks_list, i) for i in [12, 14, 16]]
        shoulder_coords = [get_landmark_coords(landmarks_list, i) for i in [14, 12, 24]]
        
        if all(elbow_coords) and all(shoulder_coords):
            metrics["elbow_angle"] = calculate_angle(*elbow_coords)
            metrics["shoulder_angle"] = calculate_angle(*shoulder_coords)
            metrics["progress"] = np.interp(metrics["elbow_angle"], (40, 160), (0, 100))
            
    elif exercise_type.lower() == "bicep_curl":
        # Calculate elbow angle for bicep curls
        elbow_coords = [get_landmark_coords(landmarks_list, i) for i in [11, 13, 15]]
        
        if all(elbow_coords):
            metrics["elbow_angle"] = calculate_angle(*elbow_coords)
            metrics["progress"] = np.interp(metrics["elbow_angle"], (40, 160), (0, 100))
            
    return metrics