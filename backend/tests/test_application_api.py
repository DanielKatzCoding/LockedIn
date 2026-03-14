import pytest

def _id(json_obj):
    return json_obj.get("id")

@pytest.mark.asyncio
async def test_create_and_get_job_application(async_client, sample_job_data):
    payload = sample_job_data
    resp = await async_client.post("/api/applications/create", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    job_id = _id(data)
    assert job_id is not None
    for key, value in sample_job_data.items():
        if key == "status":
            assert data[key].lower() == value.lower()
        else:
            assert data[key] == value
    get_resp = await async_client.get(f"/api/applications/{job_id}")
    assert get_resp.status_code == 200
    get_data = get_resp.json()
    assert get_data["id"] == job_id
    assert get_data["company"] == sample_job_data["company"]

@pytest.mark.asyncio
async def test_job_application_list_pagination(async_client, sample_job_data):
    for i in range(5):
        payload = {**sample_job_data, "company": f"Company{i}"}
        resp = await async_client.post("/api/applications/create", json=payload)
        assert resp.status_code == 201
    list_resp = await async_client.get("/api/applications?skip=0&limit=3")
    assert list_resp.status_code == 200
    assert len(list_resp.json()) == 3
    list_resp2 = await async_client.get("/api/applications?skip=3&limit=3")
    assert list_resp2.status_code == 200
    assert len(list_resp2.json()) == 2

@pytest.mark.asyncio
async def test_update_job_application(async_client, sample_job_data):
    create_resp = await async_client.post("/api/applications/create", json=sample_job_data)
    job = create_resp.json()
    job_id = _id(job)
    update_payload = {
        "id": str(job_id),
        "company": "Globex Corp",
        "job_title": job["job_title"],
        "application_date": job["application_date"],
        "job_link": job["job_link"],
        "status": "Interview",
        "notes": job["notes"],
    }
    upd_resp = await async_client.put(f"/api/applications/{job_id}", json=update_payload)
    assert upd_resp.status_code == 200
    upd_data = upd_resp.json()
    assert upd_data["company"] == "Globex Corp"
    assert upd_data["status"].upper() == "INTERVIEW"

@pytest.mark.asyncio
async def test_delete_job_application(async_client, sample_job_data):
    create_resp = await async_client.post("/api/applications/create", json=sample_job_data)
    job_id = _id(create_resp.json())
    del_resp = await async_client.delete(f"/api/applications/{job_id}")
    assert del_resp.status_code == 204
    get_resp = await async_client.get(f"/api/applications/{job_id}")
    assert get_resp.status_code == 404

# New tests for health and root endpoints
@pytest.mark.asyncio
async def test_health_endpoint(async_client):
    resp = await async_client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}

@pytest.mark.asyncio
async def test_root_endpoint(async_client):
    resp = await async_client.get("/")
    assert resp.status_code == 200
    assert resp.json() == {"message": "Welcome to LockedIn API"}
