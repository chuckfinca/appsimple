import logging
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# --- Path Configuration ---
PROJECT_ROOT = Path(__file__).parent.parent.parent
TEMPLATES_DIR = PROJECT_ROOT / "templates"
ASSETS_DIR = PROJECT_ROOT / "assets"
STATIC_DIR = PROJECT_ROOT / "static"

# --- Mount Static Directories ---
# This serves your CSS, JS, and asset images from /assets
app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")
# This serves your favicons from /static
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static_root")

# --- Set up Templates ---
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))


# --- CONDITIONAL LOCAL-ONLY ROUTES FOR ROOT STATIC FILES ---
# These routes are ONLY created when running locally.
# In production, App Engine's app.yaml handlers will serve these files.
# The `GAE_ENV` variable is automatically set to "standard" in App Engine.
if os.getenv("GAE_ENV", "").lower() != "standard":
    logger.info("Running in local development mode. Adding static file routes.")

    @app.get("/favicon.ico", include_in_schema=False)
    async def favicon():
        return FileResponse(STATIC_DIR / "favicon.ico")

    @app.get("/robots.txt", include_in_schema=False)
    async def robots():
        return FileResponse(PROJECT_ROOT / "robots.txt")


# --- Page Routes ---
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


# ... (all your other page routes: /about, /portfolio, etc. remain here) ...
@app.get("/about", response_class=HTMLResponse)
async def read_about(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})


@app.get("/services", response_class=HTMLResponse)
async def read_services(request: Request):
    return templates.TemplateResponse("services.html", {"request": request})


@app.get("/process", response_class=HTMLResponse)
async def read_process(request: Request):
    return templates.TemplateResponse("process.html", {"request": request})


@app.get("/portfolio", response_class=HTMLResponse)
async def read_portfolio(request: Request):
    return templates.TemplateResponse("portfolio.html", {"request": request})


@app.get("/contact", response_class=HTMLResponse)
async def read_contact(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request})


@app.get("/mobile/terms", response_class=HTMLResponse)
async def mobile_terms(request: Request):
    logger.info("Rendering mobile/terms.html template")
    return templates.TemplateResponse("mobile/terms.html", {"request": request})


@app.get("/mobile/privacy", response_class=HTMLResponse)
async def mobile_privacy(request: Request):
    logger.info("Rendering mobile/privacy.html template")
    return templates.TemplateResponse("mobile/privacy.html", {"request": request})


VALID_CASE_STUDIES = [
    "bodhimind",
    "guidedmind",
    "mindtimer",
    "livewire",
    "dspy-prompt-optimization",
    "llm-evaluation-prompting",
    "a-simple-auth-kit",
    "fot-recommender",
]


@app.get("/portfolio/{case_study_name}", response_class=HTMLResponse)
async def case_study_page(request: Request, case_study_name: str):
    if case_study_name not in VALID_CASE_STUDIES:
        raise HTTPException(status_code=404, detail="Case study not found")

    template_path = f"portfolio/{case_study_name}.html"
    logger.info(f"Rendering case study template: {template_path}")

    return templates.TemplateResponse(template_path, {"request": request})


# --- 404 Handler (Keep this at the end) ---
@app.exception_handler(404)
async def custom_404_handler(request: Request, exc: HTTPException):
    return templates.TemplateResponse("404.html", {"request": request}, status_code=404)
