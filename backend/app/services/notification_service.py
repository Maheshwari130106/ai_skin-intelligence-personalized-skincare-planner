from datetime import datetime

from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.user import User

from app.services.email_service import send_email


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

    # -----------------------------------------------------
    # SEND EMAIL NOTIFICATION
    # -----------------------------------------------------

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if (
    user
    and user.email
    and user.email_notifications_enabled
):

        subject_map = {
            "routine_reminder": "Skincare Routine Reminder",
            "hydration": "Hydration Reminder",
            "sleep": "Sleep Reminder",
            "replenishment": "Product Replenishment Reminder",
            "progress_alert": "Skin Progress Alert",
            "platform": "Skincare Platform Notification",
            "appointment": "Appointment Update",
        }

        subject = subject_map.get(
            notification_type,
            "Skincare Platform Notification",
        )

        send_email(
            recipient=user.email,
            subject=subject,
            message=message,
        )

    return notification
# =========================================================
# 1. ROUTINE REMINDER
# =========================================================

def create_routine_reminder(
    db: Session,
    user_id,
    routine_name="daily skincare routine",
):
    return create_notification(
        db,
        user_id,
        "routine_reminder",
        f"🧴 Time for your {routine_name}. "
        "Don't forget to complete today's skincare routine.",
    )


# =========================================================
# 2. HYDRATION REMINDER
# =========================================================

def create_hydration_reminder(db: Session, user_id):
    return create_notification(
        db,
        user_id,
        "hydration",
        "💧 Remember to drink water and stay hydrated "
        "throughout the day.",
    )


# =========================================================
# 3. SLEEP REMINDER
# =========================================================

def create_sleep_reminder(db: Session, user_id):
    return create_notification(
        db,
        user_id,
        "sleep",
        "😴 It's almost bedtime. Good sleep helps "
        "support healthy skin.",
    )


# =========================================================
# 4. PRODUCT REPLENISHMENT REMINDER
# =========================================================

def create_replenishment_reminder(
    db: Session,
    user_id,
    product_name: str,
):
    return create_notification(
        db,
        user_id,
        "replenishment",
        f"🔄 Your {product_name} may need replenishment soon.",
    )


# =========================================================
# 5. PROGRESS ALERT
# =========================================================

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


# =========================================================
# 6. PLATFORM NOTIFICATION
# =========================================================

def create_platform_notification(
    db: Session,
    user_id,
    message: str,
):
    return create_notification(
        db,
        user_id,
        "platform",
        f"🔔 {message}",
    )