import uuid
from datetime import datetime, timezone

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.srs_card import SRSCard


async def get_all_cards(db: AsyncSession, user_id: uuid.UUID) -> list[SRSCard]:
    result = await db.execute(select(SRSCard).where(SRSCard.user_id == user_id))
    return list(result.scalars().all())


async def get_due_cards(db: AsyncSession, user_id: uuid.UUID) -> list[SRSCard]:
    now = datetime.now(timezone.utc)
    result = await db.execute(
        select(SRSCard).where(and_(SRSCard.user_id == user_id, SRSCard.due <= now))
    )
    return list(result.scalars().all())


async def create_cards(db: AsyncSession, user_id: uuid.UUID, cards_data: list[dict]) -> list[SRSCard]:
    created = []
    for card_input in cards_data:
        # Check for existing (dedup)
        result = await db.execute(
            select(SRSCard).where(
                and_(
                    SRSCard.user_id == user_id,
                    SRSCard.word_id == card_input["word_id"],
                    SRSCard.skill_type == card_input["skill_type"],
                )
            )
        )
        if result.scalar_one_or_none() is not None:
            continue

        card = SRSCard(
            user_id=user_id,
            word_id=card_input["word_id"],
            skill_type=card_input["skill_type"],
            due=card_input["due"],
            card_data=card_input["card_data"],
            review_log=card_input.get("review_log", []),
        )
        db.add(card)
        created.append(card)

    if created:
        await db.commit()
        for card in created:
            await db.refresh(card)

    return created


async def review_card(
    db: AsyncSession, user_id: uuid.UUID, card_id: uuid.UUID, data: dict
) -> SRSCard | None:
    result = await db.execute(
        select(SRSCard).where(and_(SRSCard.id == card_id, SRSCard.user_id == user_id))
    )
    card = result.scalar_one_or_none()
    if card is None:
        return None

    card.due = data["due"]
    card.card_data = data["card_data"]
    card.review_log = data["review_log"]

    await db.commit()
    await db.refresh(card)
    return card
