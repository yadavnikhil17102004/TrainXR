import requests
import json

# Test the backend API
def test_backend():
    # Test the root endpoint
    print("Testing root endpoint...")
    response = requests.get("http://localhost:8000/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print()
    
    # Test the users endpoint
    print("Testing users endpoint...")
    response = requests.get("http://localhost:8000/api/users/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print()
    
    # Test the sessions endpoint
    print("Testing sessions endpoint...")
    response = requests.get("http://localhost:8000/api/sessions/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print()
    
    print("Backend test completed!")

if __name__ == "__main__":
    test_backend()