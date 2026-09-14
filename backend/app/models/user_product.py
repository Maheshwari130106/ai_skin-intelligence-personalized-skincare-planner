import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class UserProduct(Base):
    __tablename__ = "user_products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    product_id = Column(
        UUID(as_uuid=True),
        ForeignKey("products.id"),
        nullable=False,
    )

    purchased_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    expected_days = Column(
        Integer,
        default=60,
        nullable=False,
    )

    reminder_sent = Column(
        Boolean,
        default=False,
    )