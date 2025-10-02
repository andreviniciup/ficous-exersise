"""add exercise indexes

Revision ID: 002_exercise_indexes
Revises: 001_initial
Create Date: 2025-01-XX
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Índices para melhorar queries de exercises
    op.create_index('idx_exercises_user_discipline', 'ficous_exercises', ['user_id', 'discipline_id'])
    op.create_index('idx_exercise_items_exercise', 'ficous_exercise_items', ['exercise_id'])
    op.create_index('idx_exercise_attempts_user', 'ficous_exercise_attempts', ['user_id', 'exercise_id'])
    
    # Índices para embeddings (RAG)
    op.create_index('idx_embeddings_user_type', 'ficous_embeddings', ['user_id', 'owner_type'])
    
    # Índices para summaries
    op.create_index('idx_summaries_user_scope', 'ficous_summaries', ['user_id', 'scope'])

def downgrade():
    op.drop_index('idx_exercises_user_discipline')
    op.drop_index('idx_exercise_items_exercise')
    op.drop_index('idx_exercise_attempts_user')
    op.drop_index('idx_embeddings_user_type')
    op.drop_index('idx_summaries_user_scope')
