from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Query
from app.database import get_db
from app.deps import get_current_user
from app.models.user import User
from app.models.notification import Notification


router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"],
)


# =========================================================
# GET CURRENT USER NOTIFICATIONS
# =========================================================

@router.get("")
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id
        )
        .order_by(
            Notification.created_at.desc()
        )
        .all()
    )

    return notifications


@router.post("/generate-test")
def generate_test_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.services.notification_service import (
        create_routine_reminder,
        create_hydration_reminder,
        create_sleep_reminder,
        create_replenishment_reminder,
        create_progress_alert,
        create_platform_notification,
    )

    create_routine_reminder(
        db,
        current_user.id,
        "morning skincare routine",
    )

    create_replenishment_reminder(
        db,
        current_user.id,
        "Niacinamide 10% Face Serum",
    )

    create_hydration_reminder(
        db,
        current_user.id,
    )

    create_sleep_reminder(
        db,
        current_user.id,
    )

    create_progress_alert(
        db,
        current_user.id,
        "Your recent skin health progress has been updated.",
    )

    create_platform_notification(
        db,
        current_user.id,
        "Welcome to the latest version of the skincare platform.",
    )

    return {
        "ok": True,
        "message": "Test notifications generated successfully.",
    }


# =========================================================
# MARK ONE NOTIFICATION AS READ
# =========================================================

@router.post("/{notification_id}/read")
def mark_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
        .first()
    )

    if not notification:
        return {
            "ok": False,
            "message": "Notification not found",
        }

    notification.is_read = True

    db.commit()

    return {
        "ok": True,
    }


# =========================================================
# MARK ALL NOTIFICATIONS AS READ
# =========================================================

@router.post("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read == False,
        )
        .all()
    )

    for notification in notifications:
        notification.is_read = True

    db.commit()

    return {
        "ok": True,
        "updated": len(notifications),
    }
# =========================================================
# EMAIL NOTIFICATION SETTINGS
# =========================================================

@router.get("/email-settings")
def get_email_notification_settings(
    current_user: User = Depends(get_current_user),
):
    return {
        "email_notifications_enabled": (
            current_user.email_notifications_enabled
        )
    }


# =========================================================
# UPDATE EMAIL NOTIFICATION SETTINGS
# =========================================================

@router.post("/email-settings")
def update_email_notification_settings(
    enabled: bool = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    current_user.email_notifications_enabled = enabled

    db.commit()
    db.refresh(current_user)

    return {
        "ok": True,
        "email_notifications_enabled": (
            current_user.email_notifications_enabled
        ),
        "message": (
            "Email reminders enabled."
            if enabled
            else "Email reminders disabled."
        ),
    }