from .conftest import register


def authorization(token):
    return {"Authorization": f"Bearer {token}"}


def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json["status"] == "ok"


def test_register_and_login(client):
    registration = register(client)
    assert registration.status_code == 201
    assert registration.json["user"]["email"] == "pessoa@teste.com"
    assert "password_hash" not in registration.json["user"]

    login = client.post("/api/auth/login", json={
        "email": "pessoa@teste.com", "password": "123456"
    })
    assert login.status_code == 200
    assert login.json["access_token"]


def test_complete_project_volunteer_and_donation_flow(client):
    ong_response = register(client, role="ong", email="ong@teste.com")
    ong_token = ong_response.json["access_token"]
    organization_id = ong_response.json["user"]["organization_id"]

    project_response = client.post("/api/projects", headers=authorization(ong_token), json={
        "title": "Projeto Teste",
        "description": "Descrição do projeto",
        "goal": 1000,
        "deadline": "2027-12-20",
    })
    assert project_response.status_code == 201
    project_id = project_response.json["project"]["id"]

    opportunity_response = client.post("/api/opportunities", headers=authorization(ong_token), json={
        "title": "Voluntariado Teste",
        "description": "Ajude a comunidade",
        "category": "Educação",
        "date": "2027-10-20",
        "time": "09:00",
        "location": "Sede",
        "slots": 2,
    })
    assert opportunity_response.status_code == 201
    opportunity_id = opportunity_response.json["opportunity"]["id"]

    user_response = register(client)
    user_token = user_response.json["access_token"]

    volunteer_response = client.post(
        f"/api/opportunities/{opportunity_id}/registrations",
        headers=authorization(user_token),
    )
    assert volunteer_response.status_code == 201

    donation_response = client.post("/api/donations", headers=authorization(user_token), json={
        "organization_id": organization_id,
        "project_id": project_id,
        "amount": 50,
    })
    assert donation_response.status_code == 201
    assert donation_response.json["donation"]["status"] == "Confirmada"

    project = client.get(f"/api/projects/{project_id}").json["project"]
    assert project["raised"] == 50


def test_duplicate_volunteer_registration_is_rejected(client):
    ong = register(client, role="ong", email="ong2@teste.com").json
    opportunity = client.post("/api/opportunities", headers=authorization(ong["access_token"]), json={
        "title": "Ação",
        "description": "Ação comunitária",
        "category": "Outras",
        "date": "2027-11-10",
        "time": "08:00",
        "location": "Praça",
        "slots": 3,
    }).json["opportunity"]
    user = register(client, email="outra@teste.com").json
    url = f"/api/opportunities/{opportunity['id']}/registrations"
    headers = authorization(user["access_token"])
    assert client.post(url, headers=headers).status_code == 201
    assert client.post(url, headers=headers).status_code == 400
