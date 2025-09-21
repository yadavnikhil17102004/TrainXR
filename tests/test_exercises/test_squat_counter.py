import pytest
import numpy as np
from exercises.squat_counter import SquatCounter


class TestSquatCounter:
    """
    Tests for the SquatCounter class.
    """
    
    def test_initialization(self):
        """
        Test that SquatCounter initializes correctly.
        """
        counter = SquatCounter()
        assert counter.counter == 0
        assert counter.movement_dir == 0
        assert counter.correct_form == 0
        assert counter.exercise_feedback == "Fix Form"
    
    def test_count_method_exists(self):
        """
        Test that the count method exists and is callable.
        """
        counter = SquatCounter()
        assert hasattr(counter, 'count')
        assert callable(getattr(counter, 'count'))


if __name__ == "__main__":
    pytest.main([__file__])