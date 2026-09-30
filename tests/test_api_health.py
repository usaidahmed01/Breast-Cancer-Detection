"""Check the public contract and avoid claiming an unloaded model is ready."""

import unittest

from httpx import ASGITransport, AsyncClient

from api.app.main import app


class HealthTests(unittest.IsolatedAsyncioTestCase):
    async def test_health_contract_and_no_cache(self):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get("/api/v1/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["cache-control"], "no-store")
        self.assertEqual(response.json(), {
            "schemaVersion": "0.1", "service": "breast-ai-api",
            "status": "ok", "modelStatus": "not_loaded",
        })

    async def test_image_analysis_not_exposed(self):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/api/v1/studies")
        self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
