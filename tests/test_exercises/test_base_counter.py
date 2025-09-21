import pytest
import numpy as np
from exercises.base_counter import BaseCounter


class TestBaseCounter:
    """
    Tests for the BaseCounter class.
    """
    
    def test_initialization(self):
        """
        Test that BaseCounter initializes with correct default values.
        """
        counter = BaseCounter()
        assert counter.counter == 0
        assert counter.movement_dir == 0
        assert counter.correct_form == 0
        assert counter.exercise_feedback == "Fix Form"
    
    def test_abstract_count_method(self):
        """
        Test that the count method is abstract and must be implemented.
        """
        counter = BaseCounter()
        # This should raise a TypeError because count is abstract
        with pytest.raises(TypeError):
            counter.count(None)


if __name__ == "__main__":
    pytest.main([__file__])