from datetime import datetime
from zoneinfo import ZoneInfo

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User

from app.services.reminder_service import (
    create_routine_reminder,
    create_hydration_reminder,
    create_sleep_reminder,
    create_replenishment_reminder,
    create_progress_alert,
    create_platform_notification,
)

from app.models.product import Product
from app.models.progress import ProgressLog


# =========================================================
# INDIAN TIMEZONE
# =========================================================

INDIA_TZ = ZoneInfo("Asia/Kolkata")


# =========================================================
# SCHEDULER
# =========================================================

scheduler = BackgroundScheduler(
    timezone=INDIA_TZ
)


# =========================================================
# HELPER
# =========================================================

def get_active_users(db: Session):
    return (
        db.query(User)
        .filter(
            User.role == "user",
            User.is_active == True,
        )
        .all()
    )


# =========================================================
# 1. MORNING ROUTINE - 08:00 AM
# =========================================================

def generate_morning_reminders():

    db = SessionLocal()

    try:

        users = get_active_users(db)

        total = 0

        for user in users:

            try:

                notification = create_routine_reminder(
                    db,
                    user.id,
                    "morning skincare routine",
                )

                total += 1

            except Exception as e:

                print(
                    f"Morning reminder failed for "
                    f"{user.email}: {e}"
                )

        print(
            f"[08:00 AM IST] Morning routine reminders "
            f"created: {total}"
        )

    finally:
        db.close()


# =========================================================
# 2. HYDRATION - 11:00 AM
# =========================================================

def generate_hydration_reminders():

    db = SessionLocal()

    try:

        users = get_active_users(db)

        total = 0

        for user in users:

            try:

                notification = create_hydration_reminder(
                    db,
                    user.id,
                )

                total += 1

            except Exception as e:

                print(
                    f"Hydration reminder failed for "
                    f"{user.email}: {e}"
                )

        print(
            f"[11:00 AM IST] Hydration reminders "
            f"created: {total}"
        )

    finally:
        db.close()


# =========================================================
# 3. PLATFORM UPDATE - 12:00 PM
# =========================================================

def generate_platform_notifications():

    db = SessionLocal()

    try:

        users = get_active_users(db)

        total = 0

        for user in users:

            try:

                notification = create_platform_notification(
                    db,
                    user.id,
                    "You have new skincare updates "
                    "and recommendations available.",
                )

                total += 1

            except Exception as e:

                print(
                    f"Platform notification failed for "
                    f"{user.email}: {e}"
                )

        print(
            f"[12:00 PM IST] Platform notifications "
            f"created: {total}"
        )

    finally:
        db.close()


# =========================================================
# 4. PRODUCT REPLENISHMENT - 02:00 PM
# =========================================================

def generate_replenishment_reminders():

    db = SessionLocal()

    try:

        users = get_active_users(db)

        product = (
            db.query(Product)
            .filter(
                Product.is_bestseller == True
            )
            .order_by(
                Product.rating.desc()
            )
            .first()
        )

        if not product:

            product = (
                db.query(Product)
                .order_by(
                    Product.rating.desc()
                )
                .first()
            )

        if not product:

            print(
                "[02:00 PM IST] No product found."
            )

            return

        total = 0

        for user in users:

            try:

                notification = create_replenishment_reminder(
                    db,
                    user.id,
                    product.name,
                )

                total += 1

            except Exception as e:

                print(
                    f"Replenishment reminder failed for "
                    f"{user.email}: {e}"
                )

        print(
            f"[02:00 PM IST] Product replenishment "
            f"reminders created: {total}"
        )

    finally:
        db.close()


# =========================================================
# 5. PROGRESS ALERT - 06:00 PM
# =========================================================

def generate_progress_alerts():

    db = SessionLocal()

    try:

        users = get_active_users(db)

        total = 0

        for user in users:

            try:

                recent_logs = (
                    db.query(ProgressLog)
                    .filter(
                        ProgressLog.user_id == user.id
                    )
                    .order_by(
                        ProgressLog.log_date.desc()
                    )
                    .limit(2)
                    .all()
                )

                if len(recent_logs) < 2:
                    continue

                latest = recent_logs[0].skin_health_score
                previous = recent_logs[1].skin_health_score

                if (
                    latest is None
                    or previous is None
                    or latest == previous
                ):
                    continue

                change = round(
                    latest - previous,
                    2,
                )

                if change > 0:

                    message = (
                        f"Your skin health score improved "
                        f"by {change} points. Keep following "
                        f"your skincare routine!"
                    )

                else:

                    message = (
                        f"Your skin health score decreased "
                        f"by {abs(change)} points. Consider "
                        f"reviewing your skincare routine."
                    )

                notification = create_progress_alert(
                    db,
                    user.id,
                    message,
                )

                total += 1

            except Exception as e:

                print(
                    f"Progress alert failed for "
                    f"{user.email}: {e}"
                )

        print(
            f"[06:00 PM IST] Progress alerts "
            f"created: {total}"
        )

    finally:
        db.close()


# =========================================================
# 6. SLEEP REMINDER - 10:00 PM
# =========================================================

def generate_sleep_reminders():

    db = SessionLocal()

    try:

        users = get_active_users(db)

        total = 0

        for user in users:

            try:

                notification = create_sleep_reminder(
                    db,
                    user.id,
                )

                total += 1

            except Exception as e:

                print(
                    f"Sleep reminder failed for "
                    f"{user.email}: {e}"
                )

        print(
            f"[10:00 PM IST] Sleep reminders "
            f"created: {total}"
        )

    finally:
        db.close()


# =========================================================
# START SCHEDULER
# =========================================================

def start_scheduler():

    if scheduler.running:
        return

    # -----------------------------------------------------
    # 08:00 AM
    # -----------------------------------------------------

    scheduler.add_job(
        generate_morning_reminders,
        trigger="cron",
        hour=8,
        minute=0,
        id="morning_skincare_reminder",
        replace_existing=True,
    )

    # -----------------------------------------------------
    # 11:00 AM
    # -----------------------------------------------------

    scheduler.add_job(
        generate_hydration_reminders,
        trigger="cron",
        hour=11,
        minute=0,
        id="hydration_reminder",
        replace_existing=True,
    )

    # -----------------------------------------------------
    # 12:00 PM
    # -----------------------------------------------------

    scheduler.add_job(
        generate_platform_notifications,
        trigger="cron",
        hour=12,
        minute=0,
        id="platform_notification",
        replace_existing=True,
    )

    # -----------------------------------------------------
    # 02:00 PM
    # -----------------------------------------------------

    scheduler.add_job(
        generate_replenishment_reminders,
        trigger="cron",
        hour=14,
        minute=0,
        id="product_replenishment_reminder",
        replace_existing=True,
    )

    # -----------------------------------------------------
    # 06:00 PM
    # -----------------------------------------------------

    scheduler.add_job(
        generate_progress_alerts,
        trigger="cron",
        hour=18,
        minute=0,
        id="progress_alert",
        replace_existing=True,
    )

    # -----------------------------------------------------
    # 10:00 PM
    # -----------------------------------------------------

    scheduler.add_job(
        generate_sleep_reminders,
        trigger="cron",
        hour=22,
        minute=0,
        id="sleep_reminder",
        replace_existing=True,
    )

    scheduler.start()

    print("========================================")
    print("Skincare reminder scheduler started.")
    print("Timezone: Asia/Kolkata (IST)")
    print("========================================")
    print("08:00 AM - Morning skincare routine")
    print("11:00 AM - Hydration reminder")
    print("12:00 PM - Platform notification")
    print("02:00 PM - Product replenishment")
    print("06:00 PM - Progress alert")
    print("10:00 PM - Sleep reminder")
    print("========================================")


# =========================================================
# STOP SCHEDULER
# =========================================================

def stop_scheduler():

    if scheduler.running:

        scheduler.shutdown(
            wait=False
        )

        print(
            "Skincare reminder scheduler stopped."
        )