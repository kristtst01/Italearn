import httpx
import jwt
from jwt import PyJWKClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.user import User

# Clerk JWKS — derived from the publishable key domain
# Format: https://<clerk-domain>/.well-known/jwks.json
_jwks_client: PyJWKClient | None = None


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        # Get the JWKS URI from Clerk's API
        resp = httpx.get(
            "https://api.clerk.com/v1/jwks",
            headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
        )
        resp.raise_for_status()
        jwks_data = resp.json()
        # Build a PyJWKClient from the fetched JWKS
        _jwks_client = PyJWKClient(
            "https://api.clerk.com/v1/jwks",
            headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
        )
    return _jwks_client


def verify_clerk_token(token: str) -> dict:
    """Verify a Clerk session JWT and return its claims."""
    client = _get_jwks_client()
    signing_key = client.get_signing_key_from_jwt(token)
    payload = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        options={"verify_aud": False},
    )
    return payload


async def get_or_create_user(db: AsyncSession, clerk_payload: dict) -> User:
    """Upsert a user from Clerk JWT claims."""
    clerk_id = clerk_payload["sub"]

    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()

    if user is None:
        user = User(
            clerk_id=clerk_id,
            email=clerk_payload.get("email", ""),
            display_name=clerk_payload.get("name"),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return user
