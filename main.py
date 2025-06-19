from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, PlainTextResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Find base directory - use current working directory
base_dir = os.getcwd()
logger.info(f"Base directory: {base_dir}")

# Set up templates
templates_dir = os.path.join(base_dir, "templates")
if not os.path.exists(templates_dir):
    os.makedirs(templates_dir)
    logger.info(f"Created templates directory: {templates_dir}")
templates = Jinja2Templates(directory=templates_dir)

# Mount static directories
# Assets directory (CSS, JS, etc.)
assets_dir = os.path.join(base_dir, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    logger.info(f"Mounted /assets -> {assets_dir}")

# Debug route to show configuration
@app.get("/debug", response_class=PlainTextResponse)
async def debug():
    result = []
    result.append(f"Base directory: {base_dir}")
    result.append(f"Templates directory: {templates_dir}")
    result.append(f"Assets directory: {assets_dir}")
    result.append(f"Mobile directory: {mobile_dir}")
    
    # List directories
    if os.path.exists(templates_dir):
        result.append(f"Templates directory contents: {os.listdir(templates_dir)}")
    
    return "\n".join(result)

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

VALID_CASE_STUDIES = ["bodhimind", "guidedmind", "mindtimer", "livewire", "dspy-prompt-optimization", "llm-evaluation-prompting", "asimpleauthkit"]

@app.get("/portfolio/{case_study_name}", response_class=HTMLResponse)
async def case_study_page(request: Request, case_study_name: str):
    if case_study_name not in VALID_CASE_STUDIES:
        raise HTTPException(status_code=404, detail=f"Case study not found")
    
    template_path = f"portfolio/{case_study_name}.html" 
    logger.info(f"Rendering case study template: {template_path}")
        
    return templates.TemplateResponse(template_path, {"request": request})

# Main site routes - try templates first, then static files
@app.get("/{path:path}", response_class=HTMLResponse)
async def catch_all(request: Request, path: str = ""):
    # Log the request path
    logger.info(f"Catch-all route handling path: {path}")
    
    # Default to index for root path
    if path == "":
        return templates.TemplateResponse("index.html", {"request": request})
    
    # Try to render a template first
    template_path = f"{path}.html"
    template_file = os.path.join(templates_dir, template_path)
    logger.info(f"Checking for template: {template_file}")
    if os.path.exists(template_file):
        logger.info(f"Rendering template: {template_path}")
        return templates.TemplateResponse(template_path, {"request": request})
    
    # If there's no template, try to serve a static file
    file_path = path if path.endswith(('.html', '.css', '.js', '.png', '.jpg', '.gif')) else f"{path}.html"
    full_path = os.path.join(base_dir, file_path)
    logger.info(f"Checking for static file: {full_path}")
    if os.path.exists(full_path):
        logger.info(f"Serving static file: {full_path}")
        return FileResponse(full_path)
    
    # Not found
    logger.error(f"Page not found: {path}")
    return HTMLResponse(content=f"Page not found: {path}", status_code=404)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)