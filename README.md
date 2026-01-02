# CareerMate API

Your AI-Powered Job Companion backend service.

## Project Structure

```
careermate/
├── app.py                 # Flask application
├── test_app.py           # Unit tests
├── requirements.txt      # Python dependencies
├── Dockerfile           # Docker configuration
├── .github/
│   └── workflows/
│       └── ci-cd.yml    # GitHub Actions workflow
└── README.md            # This file
```

## Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

3. Run tests:
```bash
pytest test_app.py -v
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## Docker Deployment

1. Build Docker image:
```bash
docker build -t careermate .
```

2. Run container:
```bash
docker run -p 5000:5000 careermate
```

## CI/CD Pipeline

The project includes automated CI/CD pipeline using GitHub Actions:

- **Continuous Integration**: Runs tests on every push and pull request
- **Continuous Deployment**: Builds and pushes Docker image on main branch merge

### Required Secrets

Configure these secrets in your GitHub repository:

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub access token
