import pytest

from app import create_app
from app.extensions import db


@pytest.fixture()
def app(tmp_path):
    database_path = tmp_path / "test.db"
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": f"sqlite:///{database_path}",
        "JWT_SECRET_KEY": "test-secret-with-at-least-32-characters",
        "FRONTEND_URL": "http://localhost:5173",
    })
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


def register(client, role="user", email="pessoa@teste.com"):
    payload = {
        "name": "Pessoa Teste",
        "email": email,
        "password": "123456",
        "city": "João Pessoa",
        "role": role,
    }
    if role == "ong":
        payload["organization"] = {
            "name": "ONG Teste",
            "city": "João Pessoa",
            "district": "Centro",
            "category": "Educação",
            "description": "Descrição da organização.",
        }
    return client.post("/api/auth/register", json=payload)
