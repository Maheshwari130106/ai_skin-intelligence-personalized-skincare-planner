import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings


def send_email(
    recipient: str,
    subject: str,
    message: str,
):
    """
    Send an email notification to a user.
    """

    if not settings.EMAIL_NOTIFICATIONS_ENABLED:
        print("Email notifications are disabled.")
        return False

    if not recipient:
        print("No recipient email address.")
        return False

    if not settings.SMTP_USERNAME:
        print("SMTP_USERNAME is not configured.")
        return False

    if not settings.SMTP_PASSWORD:
        print("SMTP_PASSWORD is not configured.")
        return False

    try:
        email = MIMEMultipart()
        email["From"] = settings.EMAIL_FROM or settings.SMTP_USERNAME
        email["To"] = recipient
        email["Subject"] = subject

        email.attach(
            MIMEText(message, "plain", "utf-8")
        )

        with smtplib.SMTP(
            settings.SMTP_HOST,
            settings.SMTP_PORT,
        ) as server:

            server.starttls()

            server.login(
                settings.SMTP_USERNAME,
                settings.SMTP_PASSWORD,
            )

            server.send_message(email)

        print(
            f"Email notification sent to {recipient}"
        )

        return True

    except Exception as e:
        print(
            f"Email notification failed for "
            f"{recipient}: {e}"
        )

        return False