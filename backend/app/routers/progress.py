from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.progress import ProgressResponse, ProgressUpdate
from app.schemas.srs import SRSCardCreate, SRSCardResponse, SRSCardReview
from app.services import progress as progress_svc
from app.services import srs as srs_svc

router = APIRouter(prefix="/api/v1", tags=["progress"])


# --- Progress ---


@router.get("/progress", response_model=ProgressResponse)
async def get_progress(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await progress_svc.get_or_create_progress(db, user.id)


@router.put("/progress", response_model=ProgressResponse)
async def update_progress(
    body: ProgressUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    data = body.model_dump(exclude_none=True)
    return await progress_svc.update_progress(db, user.id, data)


# --- SRS Cards ---


@router.get("/srs/cards", response_model=list[SRSCardResponse])
async def get_cards(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await srs_svc.get_all_cards(db, user.id)


@router.get("/srs/due", response_model=list[SRSCardResponse])
async def get_due_cards(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await srs_svc.get_due_cards(db, user.id)


@router.post("/srs/cards", response_model=list[SRSCardResponse], status_code=status.HTTP_201_CREATED)
async def create_cards(
    cards: list[SRSCardCreate],
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cards_data = [c.model_dump() for c in cards]
    return await srs_svc.create_cards(db, user.id, cards_data)


@router.put("/srs/cards/{card_id}/review", response_model=SRSCardResponse)
async def review_card(
    card_id: str,
    body: SRSCardReview,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    card = await srs_svc.review_card(db, user.id, card_id, body.model_dump())
    if card is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    return card
