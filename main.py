from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
import os
import uvicorn
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Find the base directory in a more robust way
# First, try the current working directory
cwd = os.getcwd()
logger.info(f"Current working directory: {cwd}")

# Check possible locations for the 'mobile' directory
possible_locations = [
    cwd,  # Current directory
    os.path.join(cwd, "mobile"),  # mobile subfolder
    os.path.dirname(cwd),  # Parent directory
    os.path.join(os.path.dirname(cwd), "mobile"),  # mobile folder in parent
    str(Path(__file__).resolve().parent),  # Directory of this script
]

# Find the mobile directory
mobile_path = None
for loc in possible_locations:
    test_path = loc if loc.endswith("mobile") else os.path.join(loc, "mobile")
    logger.info(f"Checking for mobile directory in: {test_path}")
    if os.path.isdir(test_path):
        logger.info(f"Found mobile directory at: {test_path}")
        mobile_path = test_path
        # Check if it contains index.html
        if os.path.exists(os.path.join(test_path, "index.html")):
            logger.info(f"Found index.html in {test_path}")
            break
        else:
            logger.warning(f"Found directory but no index.html in {test_path}")

if not mobile_path:
    logger.error("Mobile directory not found in any expected location!")
    # We'll continue and handle this in the routes

# Mount static directories if we found them
if mobile_path:
    # We'll use explicit routes for HTML files instead of mounting the whole directory
    # This gives us more control and avoids potential routing conflicts
    
    # Mount CSS directory
    css_path = os.path.join(mobile_path, "css")
    if os.path.isdir(css_path):
        logger.info(f"Found CSS directory at: {css_path}")
        app.mount("/mobile/css", StaticFiles(directory=css_path), name="mobile_css")
    
    # Mount images directory
    images_path = os.path.join(mobile_path, "images")
    if os.path.isdir(images_path):
        logger.info(f"Found images directory at: {images_path}")
        app.mount("/mobile/images", StaticFiles(directory=images_path), name="mobile_images")
        
    logger.info(f"Using explicit routes for mobile HTML files instead of mounting directory")

# Try to find the 'assets' directory
assets_path = None
for loc in possible_locations:
    test_path = os.path.join(loc, "assets")
    if os.path.isdir(test_path):
        assets_path = test_path
        logger.info(f"Found assets directory at: {test_path}")
        break

if assets_path:
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")
    logger.info(f"Mounted /assets -> {assets_path}")

# Root directory for main HTML files
html_root = None
for loc in possible_locations:
    test_path = loc
    if os.path.exists(os.path.join(test_path, "index.html")):
        html_root = test_path
        logger.info(f"Found main index.html in: {test_path}")
        break

# Pages directory
pages_dir = None
for loc in possible_locations:
    test_path = os.path.join(loc, "pages")
    if os.path.isdir(test_path):
        pages_dir = test_path
        logger.info(f"Found pages directory at: {test_path}")
        break

# Debug route to show all paths
@app.get("/debug", response_class=PlainTextResponse)
async def debug():
    result = []
    result.append(f"Current working directory: {cwd}")
    result.append(f"Mobile path: {mobile_path}")
    result.append(f"Assets path: {assets_path}")
    result.append(f"HTML root: {html_root}")
    result.append(f"Pages directory: {pages_dir}")
    
    # Check for mobile index
    if mobile_path:
        mobile_index = os.path.join(mobile_path, "index.html")
        result.append(f"Mobile index.html exists: {os.path.exists(mobile_index)}")
        
        # List mobile directory contents
        result.append(f"Mobile directory contents: {os.listdir(mobile_path)}")
    
    # Check for specific mobile pages
    for page in ["bodhimind.html", "guidedmind.html", "livewire.html", "mindtimer.html"]:
        if mobile_path:
            page_path = os.path.join(mobile_path, page)
            result.append(f"{page} exists: {os.path.exists(page_path)}")
    
    return "\n".join(result)

# Main routes - fallback to individual file serving if mounting didn't work
@app.get("/", response_class=HTMLResponse)
async def read_index():
    if html_root:
        index_path = os.path.join(html_root, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
    return HTMLResponse(content="Main index.html not found", status_code=404)

@app.get("/mobile", response_class=HTMLResponse)
async def mobile_index():
    # This is a fallback if the static file mounting didn't work
    if mobile_path:
        index_path = os.path.join(mobile_path, "index.html")
        if os.path.exists(index_path):
            logger.info(f"Serving mobile index from: {index_path}")
            return FileResponse(index_path)
        else:
            logger.error(f"Mobile index.html not found at: {index_path}")
    return HTMLResponse(content="Mobile index.html not found", status_code=404)

# Handle specific mobile pages by name for explicit control
@app.get("/mobile/bodhimind", response_class=HTMLResponse)
async def mobile_bodhimind():
    if mobile_path:
        page_path = os.path.join(mobile_path, "bodhimind.html")
        if os.path.exists(page_path):
            logger.info(f"Serving bodhimind from: {page_path}")
            return FileResponse(page_path)
    return HTMLResponse(content="Bodhi Mind page not found", status_code=404)

@app.get("/mobile/guidedmind", response_class=HTMLResponse)
async def mobile_guidedmind():
    if mobile_path:
        page_path = os.path.join(mobile_path, "guidedmind.html")
        if os.path.exists(page_path):
            logger.info(f"Serving guidedmind from: {page_path}")
            return FileResponse(page_path)
    return HTMLResponse(content="Guided Mind page not found", status_code=404)

@app.get("/mobile/livewire", response_class=HTMLResponse)
async def mobile_livewire():
    if mobile_path:
        page_path = os.path.join(mobile_path, "livewire.html")
        if os.path.exists(page_path):
            logger.info(f"Serving livewire from: {page_path}")
            return FileResponse(page_path)
    return HTMLResponse(content="Livewire page not found", status_code=404)

@app.get("/mobile/mindtimer", response_class=HTMLResponse)
async def mobile_mindtimer():
    if mobile_path:
        page_path = os.path.join(mobile_path, "mindtimer.html")
        if os.path.exists(page_path):
            logger.info(f"Serving mindtimer from: {page_path}")
            return FileResponse(page_path)
    return HTMLResponse(content="Mind Timer page not found", status_code=404)

@app.get("/mobile/privacy", response_class=HTMLResponse)
async def mobile_privacy():
    if mobile_path:
        page_path = os.path.join(mobile_path, "privacy.html")
        if os.path.exists(page_path):
            logger.info(f"Serving mobile privacy from: {page_path}")
            return FileResponse(page_path)
    return HTMLResponse(content="Mobile privacy page not found", status_code=404)

@app.get("/mobile/terms", response_class=HTMLResponse)
async def mobile_terms():
    if mobile_path:
        page_path = os.path.join(mobile_path, "terms.html")
        if os.path.exists(page_path):
            logger.info(f"Serving mobile terms from: {page_path}")
            return FileResponse(page_path)
    return HTMLResponse(content="Mobile terms page not found", status_code=404)

# Generic handler for any mobile page with .html explicitly in URL
@app.get("/mobile/{page}.html", response_class=HTMLResponse)
async def mobile_page_with_html(page: str):
    if mobile_path:
        page_path = os.path.join(mobile_path, f"{page}.html")
        if os.path.exists(page_path):
            logger.info(f"Serving mobile page from: {page_path}")
            return FileResponse(page_path)
        else:
            logger.error(f"Mobile page not found at: {page_path}")
    return HTMLResponse(content=f"Mobile page {page}.html not found", status_code=404)

# Generic handler for any other mobile page 
@app.get("/mobile/{page}", response_class=HTMLResponse)
async def mobile_page(page: str):
    # This is a fallback if the specific routes above don't match
    if mobile_path:
        # First try without .html extension (might be a directory)
        dir_path = os.path.join(mobile_path, page)
        if os.path.isdir(dir_path):
            index_path = os.path.join(dir_path, "index.html")
            if os.path.exists(index_path):
                logger.info(f"Serving directory index from: {index_path}")
                return FileResponse(index_path)
        
        # Then try with .html extension
        page_path = os.path.join(mobile_path, f"{page}.html")
        if os.path.exists(page_path):
            logger.info(f"Serving mobile page from: {page_path}")
            return FileResponse(page_path)
        else:
            logger.error(f"Mobile page not found at: {page_path}")
    return HTMLResponse(content=f"Mobile page {page} not found", status_code=404)

@app.get("/{page}", response_class=HTMLResponse)
async def read_page(page: str):
    # Handle pages in the pages directory
    if pages_dir and page in ["services", "process", "about", "contact"]:
        page_path = os.path.join(pages_dir, f"{page}.html")
        if os.path.exists(page_path):
            return FileResponse(page_path)
    
    # Handle root pages
    if html_root and page in ["privacy", "terms"]:
        page_path = os.path.join(html_root, f"{page}.html")
        if os.path.exists(page_path):
            return FileResponse(page_path)
            
    return HTMLResponse(content=f"Page {page} not found", status_code=404)

# Favicon route
@app.get("/favicon.ico")
async def favicon():
    if html_root:
        favicon_path = os.path.join(html_root, "favicon.ico")
        if os.path.exists(favicon_path):
            return FileResponse(favicon_path)
    return HTMLResponse(content="Favicon not found", status_code=404)

if __name__ == "__main__":
    # Run the application with uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)