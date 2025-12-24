from copy import deepcopy
import pytest
from fastapi.testclient import TestClient

from src import app as srv

client = TestClient(srv.app)
_ORIGINAL = deepcopy(srv.activities)


@pytest.fixture(autouse=True)
def reset_activities():
    # restore in-memory activities before each test
    srv.activities = deepcopy(_ORIGINAL)
    yield


def test_get_activities():
    resp = client.get("/activities")
    assert resp.status_code == 200
    data = resp.json()
    assert "Chess Club" in data


def test_signup_and_reflects():
    resp = client.post("/activities/Chess%20Club/signup?email=testuser@example.com")
    assert resp.status_code == 200

    resp2 = client.get("/activities")
    assert resp2.status_code == 200
    assert "testuser@example.com" in resp2.json()["Chess Club"]["participants"]


def test_duplicate_signup_returns_400():
    resp = client.post("/activities/Chess%20Club/signup?email=michael@mergington.edu")
    assert resp.status_code == 400


def test_unregister_participant():
    # michael is in initial data
    resp = client.delete("/activities/Chess%20Club/participants?email=michael@mergington.edu")
    assert resp.status_code == 200

    resp2 = client.get("/activities")
    assert "michael@mergington.edu" not in resp2.json()["Chess Club"]["participants"]
