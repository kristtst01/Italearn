"""add feedback table

Revision ID: b4f1c2d3e5a6
Revises: a7d3e1c0b9f2
Create Date: 2026-11-14 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = 'b4f1c2d3e5a6'
down_revision: Union[str, None] = 'a7d3e1c0b9f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'feedback',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('quote', sa.Text(), nullable=True),
        sa.Column('context', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('learner_categories', postgresql.ARRAY(sa.String(length=40)), nullable=False),
        sa.Column('categories', postgresql.ARRAY(sa.String(length=40)), nullable=True),
        sa.Column('category_by_admin', sa.Boolean(), nullable=False),
        sa.Column('summary', sa.String(length=200), nullable=True),
        sa.Column('pressing', sa.Boolean(), nullable=False),
        sa.Column('verdict', sa.Text(), nullable=True),
        sa.Column('triaged_at', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('reply', sa.Text(), nullable=True),
        sa.Column('learner_unread', sa.Boolean(), nullable=False),
        sa.Column('hidden_by_learner', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_feedback_user', 'feedback', ['user_id', 'created_at'], unique=False)
    op.create_index('ix_feedback_status', 'feedback', ['status'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_feedback_status', table_name='feedback')
    op.drop_index('ix_feedback_user', table_name='feedback')
    op.drop_table('feedback')
