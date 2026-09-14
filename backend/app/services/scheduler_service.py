from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.services.reminder_service import generate_user_reminders


scheduler = BackgroundScheduler()


def generate_all_user_reminders():
    """
    Generate daily reminders for all normal users.
    """

    db: Session = SessionLocal()

    try:
        users = (
            db.query(User)
            .filter(
                User.role == "user",
                User.is_active == True,
            )
            .all()
        )

        total_created = 0

        for user in users:
            try:
                created = generate_user_reminders(
                    db,
                    user,
                )

                total_created += len(created)

            except Exception as e:
                print(
                    f"Reminder generation failed for "
                    f"user {user.id}: {e}"
                )

        print(
            f"Reminder scheduler completed. "
            f"Created {total_created} notifications."
        )

    finally:
        db.close()


def start_scheduler():
    """
    Start the background reminder scheduler.
    """

    if scheduler.running:
        return

    scheduler.add_job(
        generate_all_user_reminders,
        trigger="cron",
        hour=9,
        minute=0,
        id="daily_skincare_reminders",
        replace_existing=True,
    )

    scheduler.start()

    print(
        "Skincare reminder scheduler started."
    )


def stop_scheduler():
    """
    Stop the background scheduler.
    """

    if scheduler.running:
        scheduler.shutdown(
            wait=False
        )

        print(
            "Skincare reminder scheduler stopped."
        )