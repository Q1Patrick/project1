# CareerMate API

AI-Powered Job Companion backend service.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run API server
python app.py

# Run tests
pytest test_app.py -v
```


- `GET /` - Welcome message
- `GET /health` - Health check


```bash
# Build image
docker build -t cm5-careermate .

# Run container
docker run -p 5000:5000 cm5-careermate
```


- **Test Job**: Runs unit tests with coverage
- **Build Job**: Creates Docker image artifact
- **Triggers**: Push to main/develop branches
- **Artifacts**: Docker image download available


```
cm5-ci-cd/
├── app.py              # Flask API
├── test_app.py          # Unit tests
├── requirements.txt     # Dependencies
├── Dockerfile          # Container config
└── .github/workflows/ # CI/CD pipeline
```
