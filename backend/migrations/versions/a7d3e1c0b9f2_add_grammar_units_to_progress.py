"""add grammar_units to user_progress

Revision ID: a7d3e1c0b9f2
Revises: c1e782f9e61f
Create Date: 2026-09-30 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'a7d3e1c0b9f2'
down_revision: Union[str, None] = 'c1e782f9e61f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'user_progress',
        sa.Column('grammar_units', postgresql.JSONB(astext_type=sa.Text()), server_default='{}', nullable=False),
    )


def downgrade() -> None:
    op.drop_column('user_progress', 'grammar_units')
