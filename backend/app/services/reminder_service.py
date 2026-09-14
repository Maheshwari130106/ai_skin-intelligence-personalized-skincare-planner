from datetime import datetime

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.routine import SkincareRoutine
from app.models.progress import ProgressLog
from app.models.notification import Notification
from app.models.product import Product

from app.services.notification_service import (
    create_routine_reminder,
    create_hydration_reminder,
    create_sleep_reminder,
    create_replenishment_reminder,
    create_progress_alert,
)


# =========================================================
# CHECK IF NOTIFICATION ALREADY EXISTS TODAY
# =========================================================

def notification_exists_today(
    db: Session,
    user_id,
    notification_type: str,
):
    """
    Prevent duplicate notifications of the same type
    from being generated on the same day.
    """

    start_of_day = datetime.utcnow().replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    notification = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.type == notification_type,
            Notification.created_at >= start_of_day,
        )
        .first()
    )

    return notification is not None


# =========================================================
# GENERATE USER REMINDERS
# =========================================================

def generate_user_reminders(
    db: Session,
    user: User,
):
    """
    Generate personalized daily skincare reminders.

    Reminder types:
        1. Routine reminder
        2. Hydration reminder
        3. Sleep reminder
        4. Product replenishment reminder
        5. Progress alert

    Duplicate reminders are prevented for the same day.
    """

    created = []

    # =====================================================
    # 1. ROUTINE REMINDER
    # =====================================================

    routine = (
        db.query(SkincareRoutine)
        .filter(
            SkincareRoutine.user_id == user.id
        )
        .first()
    )

    if (
        routine
        and not notification_exists_today(
            db,
            user.id,
            "routine_reminder",
        )
    ):

        notification = create_routine_reminder(
            db,
            user.id,
            "daily skincare routine",
        )

        created.append(notification)

    # =====================================================
    # 2. HYDRATION REMINDER
    # =====================================================

    if not notification_exists_today(
        db,
        user.id,
        "hydration",
    ):

        notification = create_hydration_reminder(
            db,
            user.id,
        )

        created.append(notification)

    # =====================================================
    # 3. SLEEP REMINDER
    # =====================================================

    if not notification_exists_today(
        db,
        user.id,
        "sleep",
    ):

        notification = create_sleep_reminder(
            db,
            user.id,
        )

        created.append(notification)

    # =====================================================
    # 4. PRODUCT REPLENISHMENT REMINDER
    # =====================================================

    if not notification_exists_today(
        db,
        user.id,
        "replenishment",
    ):

        # Get an available product from the platform.
        product = (
            db.query(Product)
            .order_by(
                Product.is_bestseller.desc(),
                Product.rating.desc(),
            )
            .first()
        )

        if product:

            notification = create_replenishment_reminder(
                db,
                user.id,
                product.name,
            )

            created.append(notification)

    # =====================================================
    # 5. PROGRESS ALERT
    # =====================================================

    recent_logs = (
        db.query(ProgressLog)
        .filter(
            ProgressLog.user_id == user.id
        )
        .order_by(
            ProgressLog.log_date.desc()
        )
        .limit(5)
        .all()
    )

    # Need at least two progress records to compare scores.
    if len(recent_logs) >= 2:

        latest_score = recent_logs[0].skin_health_score
        previous_score = recent_logs[1].skin_health_score

        if (
            latest_score is not None
            and previous_score is not None
            and latest_score < previous_score
            and not notification_exists_today(
                db,
                user.id,
                "progress_alert",
            )
        ):

            decrease = round(
                previous_score - latest_score,
                2,
            )

            notification = create_progress_alert(
                db,
                user.id,
                (
                    f"Your skin health score decreased by "
                    f"{decrease} points. Consider reviewing "
                    f"your skincare routine."
                ),
            )

            created.append(notification)

    # =====================================================
    # RETURN CREATED NOTIFICATIONS
    # =====================================================

    return created