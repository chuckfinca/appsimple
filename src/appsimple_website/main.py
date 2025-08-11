import logging
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

PROJECT_ROOT = Path(__file__).parent.parent.parent
TEMPLATES_DIR = PROJECT_ROOT / "templates"
ASSETS_DIR = PROJECT_ROOT / "assets"
STATIC_DIR = PROJECT_ROOT / "static"

# Set up templates
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# Mount static directory
app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse(STATIC_DIR / "favicon.ico")

@app.get("/apple-touch-icon.png", include_in_schema=False)
async def apple_touch_icon():
    return FileResponse(STATIC_DIR / "apple-touch-icon.png")

@app.get("/favicon.svg", include_in_schema=False)
async def favicon_svg():
    return FileResponse(STATIC_DIR / "favicon.svg")
    
@app.get("/favicon-96x96.png", include_in_schema=False)
async def favicon_96():
    return FileResponse(STATIC_DIR / "favicon-96x96.png")

@app.get("/site.webmanifest", include_in_schema=False)
async def site_manifest():
    return FileResponse(STATIC_DIR / "site.webmanifest")
    
@app.get("/web-app-manifest-192x192.png", include_in_schema=False)
async def web_app_manifest_192():
    return FileResponse(STATIC_DIR / "web-app-manifest-192x192.png")

@app.get("/web-app-manifest-512x512.png", include_in_schema=False)
async def web_app_manifest_512():
    return FileResponse(STATIC_DIR / "web-app-manifest-512x512.png")

@app.get("/robots.txt", include_in_schema=False)
async def robots():
    return FileResponse(PROJECT_ROOT / "robots.txt")

# Root route - explicitly handle the homepage
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    logger.info("Rendering index.html template")
    return templates.TemplateResponse("index.html", {"request": request})


# Explicitly handle common pages with templates
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


@app.exception_handler(404)
async def custom_404_handler(request: Request, exc: HTTPException):
    """
    Handles all 404 Not Found errors by rendering the custom 404.html template.
    """
    logger.error(f"Page not found for path: {request.url.path}")
    return templates.TemplateResponse("404.html", {"request": request}, status_code=404)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
