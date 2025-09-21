# 🏋️ TrainXR - Exercise Tracking System

This project uses computer vision to track and count various exercises in real-time. It leverages the MediaPipe library for pose estimation and OpenCV for image processing. The system provides real-time feedback on exercise form and counts repetitions as users perform exercises.

## 🎯 Features

- Real-time exercise tracking and counting for push-ups, squats, bicep curls, pull-ups, and deadlifts
- Visual feedback on user's form (correct or needs fixing)
- Progress bar indicating completion of each exercise
- Percentage display of exercise progress
- RESTful API for integration with mobile applications
- Modular architecture for easy extension

## 🏗️ Project Structure

```
trainxr/
├── api/                    # Backend API endpoints
│   ├── main.py            # FastAPI application entry point
│   ├── routes/            # API route handlers
│   └── models/            # Data models and schemas
│
├── core/                  # Core system components
│   ├── config.py          # Configuration settings
│   └── logger.py          # Logging utilities
│
├── exercises/             # Exercise-specific counter modules
│   ├── base_counter.py    # Base counter class
│   ├── squat_counter.py   # Squat counter implementation
│   ├── deadlift_counter.py # Deadlift counter implementation
│   ├── pushup_counter.py  # Push-up counter implementation
│   ├── pullup_counter.py  # Pull-up counter implementation
│   ├── bicep_curl_counter.py # Bicep curl counter implementation
│   └── utils/             # Exercise-specific utilities
│
├── video_processor/       # Video processing components
│   ├── video_handler.py   # Video input/output handling
│   └── frame_analyzer.py  # Frame-by-frame analysis
│
├── examples/              # Example usage scripts
│   ├── process_video_file.py
│   └── live_camera_demo.py
│
├── tests/                 # Unit and integration tests
├── docs/                  # Documentation
├── requirements.txt       # Project dependencies
└── README.md             # Project documentation
```

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TrainXR
   ```

2. (Optional) Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required libraries:
   ```bash
   pip install -r requirements.txt
   ```

## ▶️ Usage

### Running the API Server

```bash
cd api
python main.py
```

The API will be available at `http://localhost:8000`. API documentation can be found at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Example Scripts

1. **Process Video File**:
   ```bash
   python examples/process_video_file.py
   ```

2. **Live Camera Demo**:
   ```bash
   python examples/live_camera_demo.py
   ```

### API Endpoints

- `GET /exercise/types` - Get list of supported exercise types
- `POST /exercise/analyze` - Analyze exercise form in uploaded video
- `POST /exercise/count` - Count exercise repetitions in a video file

## 🧪 Testing

To run tests:
```bash
python -m pytest tests/
```

## 📚 Documentation

API documentation is available through the FastAPI Swagger UI at `http://localhost:8000/docs` when the server is running.

## 🛠️ Development

### Code Style

This project uses Black for code formatting and Flake8 for linting. To format code:

```bash
black .
flake8 .
```

## 🔮 Future Enhancements

- Add more exercise types
- Implement real-time feedback using TensorFlow Lite
- Add database integration for workout history
- Improve form analysis algorithms
- Add mobile app integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- MediaPipe team for the pose estimation library
- OpenCV community for computer vision tools
- FastAPI for the web framework