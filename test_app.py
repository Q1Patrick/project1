import pytest
import json
from app import app

@pytest.fixture
def client():
    """Create test client."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    """Test /health endpoint."""
    response = client.get('/health')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert 'timestamp' in data
    assert data['service'] == 'CareerMate API'
    assert data['version'] == '1.0.0'

def test_index_endpoint(client):
    """Test / endpoint."""
    response = client.get('/')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert 'CareerMate API' in data['message']
    assert data['version'] == '1.0.0'

def test_health_endpoint_response_time(client):
    """Test health endpoint response time."""
    import time
    start_time = time.time()
    response = client.get('/health')
    end_time = time.time()
    
    assert response.status_code == 200
    assert (end_time - start_time) < 1.0  # Should respond within 1 second
