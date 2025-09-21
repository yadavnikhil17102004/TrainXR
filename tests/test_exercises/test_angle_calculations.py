import pytest
import numpy as np
from exercises.utils.angle_calculations import calculate_angle, get_landmark_coords


class TestAngleCalculations:
    """
    Tests for the angle calculations utility functions.
    """
    
    def test_calculate_angle(self):
        """
        Test angle calculation between three points.
        """
        # Test right angle (90 degrees)
        p1 = (0, 0)
        p2 = (0, 1)
        p3 = (1, 1)
        angle = calculate_angle(p1, p2, p3)
        assert abs(angle - 90.0) < 0.1
        
        # Test straight angle (180 degrees)
        p1 = (0, 0)
        p2 = (1, 0)
        p3 = (2, 0)
        angle = calculate_angle(p1, p2, p3)
        assert abs(angle - 180.0) < 0.1
        
        # Test zero angle (0 degrees)
        p1 = (2, 0)
        p2 = (1, 0)
        p3 = (0, 0)
        angle = calculate_angle(p1, p2, p3)
        assert abs(angle - 0.0) < 0.1
    
    def test_get_landmark_coords(self):
        """
        Test retrieving landmark coordinates from landmarks list.
        """
        landmarks_list = [
            [0, 100, 200],
            [1, 150, 250],
            [2, 200, 300]
        ]
        
        # Test valid landmark ID
        coords = get_landmark_coords(landmarks_list, 1)
        assert coords == (150, 250)
        
        # Test invalid landmark ID
        coords = get_landmark_coords(landmarks_list, 5)
        assert coords is None


if __name__ == "__main__":
    pytest.main([__file__])