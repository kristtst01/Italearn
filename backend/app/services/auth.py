import base64

import jwt
from jwt import PyJWKClient
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.user import User

_jwks_client: PyJWKClient | None = None


def _clerk_jwks_url() -> str:
    """Derive the public JWKS URL from CLERK_PUBLISHABLE_KEY."""
    pk = settings.CLERK_PUBLISHABLE_KEY
    # pk_test_<base64-encoded-domain>$ or pk_live_<...>$
    encoded = pk.split("_", 2)[2]
    domain = base64.b64decode(encoded + "==").decode().rstrip("$")
    return f"https://{domain}/.well-known/jwks.json"


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(_clerk_jwks_url())
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
        try:
            user = User(
                clerk_id=clerk_id,
                email=clerk_payload.get("email", ""),
                display_name=clerk_payload.get("name"),
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        except IntegrityError:
            await db.rollback()
            result = await db.execute(select(User).where(User.clerk_id == clerk_id))
            user = result.scalar_one()

    return user
