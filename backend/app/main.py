from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.database import Base, engine

# =========================================================
# MODELS
# =========================================================

from app.models import (
    user,
    skin_profile,
    assessment,
    skin_concern,
    risk_factor,
    routine,
    ingredient,
    product,
    progress,
    user_product,
    notification,
    recommendation,
    checklist,
    routine_history,
    appointment,
)

# =========================================================
# ROUTERS
# =========================================================

from app.routers import (
    auth,
    users,
    skin_profile as skin_profile_router,
    assessment as assessment_router,
    routine as routine_router,
    ingredient as ingredient_router,
    product as product_router,
    progress as progress_router,
    dashboard,
    notification as notification_router,
    reports,
    admin,
    clients,
    recommendations,
    checklist as checklist_router,
    oauth as oauth_router,
    ml,
    consultant as consultant_router,
    consultant,
)

# =========================================================
# SCHEDULER
# =========================================================

from app.services.scheduler_service import (
    start_scheduler,
    stop_scheduler,
)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="AI Skin Intelligence & Personalized Skincare Planner API",
    description=(
        "Personalized skincare routines, ingredient intelligence, "
        "product recommendations, and progress tracking."
    ),
    version="1.0.0",
)


# =========================================================
# UPLOAD DIRECTORY
# =========================================================

import os

os.makedirs("/app/uploads", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="/app/uploads"),
    name="uploads",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# SESSION MIDDLEWARE
# =========================================================

# Required by Authlib to store OAuth state/nonce
# between the login redirect and callback.

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
)


# =========================================================
# DATABASE
# =========================================================

# Create tables on startup.
# Use Alembic migrations for production.

Base.metadata.create_all(bind=engine)


# =========================================================
# APPLICATION STARTUP
# =========================================================

@app.on_event("startup")
def startup_event():
    """
    Start the daily skincare reminder scheduler
    when the FastAPI application starts.
    """

    start_scheduler()


# =========================================================
# APPLICATION SHUTDOWN
# =========================================================

@app.on_event("shutdown")
def shutdown_event():
    """
    Stop the reminder scheduler when the
    FastAPI application shuts down.
    """

    stop_scheduler()


# =========================================================
# ROUTER REGISTRATION
# =========================================================

app.include_router(auth.router)

app.include_router(users.router)

app.include_router(
    skin_profile_router.router
)

app.include_router(
    assessment_router.router
)

app.include_router(
    routine_router.router
)

app.include_router(
    ingredient_router.router
)

app.include_router(
    product_router.router
)

app.include_router(
    progress_router.router
)

app.include_router(
    dashboard.router
)

app.include_router(
    notification_router.router
)

app.include_router(
    reports.router
)

app.include_router(
    admin.router
)

app.include_router(
    clients.router
)

app.include_router(
    recommendations.router
)

app.include_router(
    checklist_router.router
)

app.include_router(
    oauth_router.router
)

app.include_router(
    ml.router
)

app.include_router(
    consultant_router.router
)


# =========================================================
# ROOT ENDPOINT
# =========================================================

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": (
            "AI Skin Intelligence & Personalized "
            "Skincare Planner"
        ),
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }