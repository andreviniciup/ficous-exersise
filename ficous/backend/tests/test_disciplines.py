"""
Testes para CRUD de Disciplinas
"""
import pytest


def test_create_discipline(client):
    """Testa criação de disciplina"""
    response = client.post("/ficous/disciplines/", json={
        "name": "Matemática"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Matemática"
    assert "id" in data


def test_list_disciplines(client, sample_discipline):
    """Testa listagem de disciplinas"""
    response = client.get("/ficous/disciplines/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["name"] == sample_discipline.name


def test_update_discipline(client, sample_discipline):
    """Testa atualização de disciplina"""
    response = client.put(f"/ficous/disciplines/{sample_discipline.id}", json={
        "name": "Programação Avançada"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Programação Avançada"


def test_delete_discipline(client, sample_discipline):
    """Testa exclusão de disciplina"""
    response = client.delete(f"/ficous/disciplines/{sample_discipline.id}")
    assert response.status_code == 204
    
    # Verifica que foi deletada
    response = client.get("/ficous/disciplines/")
    data = response.json()
    assert len(data) == 0


def test_create_discipline_empty_name(client):
    """Testa validação de nome vazio"""
    response = client.post("/ficous/disciplines/", json={
        "name": ""
    })
    assert response.status_code == 422


def test_update_nonexistent_discipline(client):
    """Testa atualização de disciplina inexistente"""
    fake_id = "00000000-0000-0000-0000-000000000001"
    response = client.put(f"/ficous/disciplines/{fake_id}", json={
        "name": "Teste"
    })
    assert response.status_code == 404