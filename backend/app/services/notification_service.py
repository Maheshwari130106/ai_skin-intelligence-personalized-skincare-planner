from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.notification import Notification


def create_notification(
    db: Session,
    user_id,
    notification_type: str,
    message: str,
):
    notification = Notification(
        user_id=user_id,
        type=notification_type,
        message=message,
        is_read=False,
        created_at=datetime.utcnow(),
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification


def create_routine_reminder(db: Session, user_id, routine_name="skincare routine"):
    return create_notification(
        db,
        user_id,
        "routine_reminder",
        f"Time for your {routine_name}. Don't forget to complete today's skincare routine.",
    )


def create_hydration_reminder(db: Session, user_id):
    return create_notification(
        db,
        user_id,
        "hydration",
        "💧 Remember to drink water and stay hydrated throughout the day.",
    )


def create_sleep_reminder(db: Session, user_id):
    return create_notification(
        db,
        user_id,
        "sleep",
        "😴 It's almost bedtime. Good sleep helps support healthy skin.",
    )


def create_replenishment_reminder(
    db: Session,
    user_id,
    product_name: str,
):
    return create_notification(
        db,
        user_id,
        "replenishment",
        f"🛍️ Your {product_name} may need replenishment soon.",
    )


def create_progress_alert(
    db: Session,
    user_id,
    message: str,
):
    return create_notification(
        db,
        user_id,
        "progress_alert",
        f"📈 {message}",
    )


def create_platform_notification(
    db: Session,
    user_id,
    message: str,
):
    return create_notification(
        db,
        user_id,
        "platform",
        message,
    )