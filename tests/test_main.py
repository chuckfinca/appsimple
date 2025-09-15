from fastapi.testclient import TestClient

from appsimple_website.main import app  # Import the app from its new location

client = TestClient(app)


def test_read_root():
    """Test that the homepage loads successfully."""
    response = client.get("/")
    assert response.status_code == 200
    assert "<title>Applied AI Engineer</title>" in response.text


def test_read_portfolio():
    """Test that the portfolio page loads successfully."""
    response = client.get("/portfolio")
    assert response.status_code == 200
    assert "<h1>Portfolio</h1>" in response.text
