from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
from pathlib import Path

app = FastAPI()

# Determine if we're running locally or on App Engine
is_local = not os.environ.get("GAE_APPLICATION")

# Directory where your actual JS files are located in development
base_dir = Path(__file__).parent
static_files_dir = base_dir

# Mount static files directory
app.mount("/assets", StaticFiles(directory="assets"), name="assets")

# Special routes for JS files when running locally
if is_local:
    @app.get("/assets/js/modules/typing.js")
    async def serve_typing_js():
        """Serve typing.js from root when running locally"""
        typing_js_path = base_dir / "typing.js"
        if typing_js_path.exists():
            return FileResponse(typing_js_path, media_type="application/javascript")
        raise HTTPException(status_code=404, detail="typing.js not found")
    
    @app.get("/assets/js/modules/utils.js")
    async def serve_utils_js():
        """Serve utils.js from root when running locally"""
        utils_js_path = base_dir / "utils.js"
        if utils_js_path.exists():
            return FileResponse(utils_js_path, media_type="application/javascript")
        raise HTTPException(status_code=404, detail="utils.js not found")
    
    @app.get("/assets/js/main.js")
    async def serve_main_js():
        """Serve main.js from root when running locally"""
        main_js_path = base_dir / "main.js"
        if main_js_path.exists():
            return FileResponse(main_js_path, media_type="application/javascript")
        raise HTTPException(status_code=404, detail="main.js not found")

# Route for the main page and other static files
@app.get("/", response_class=HTMLResponse)
async def get_index():
    """Serve the index.html file"""
    index_path = base_dir / "index.html"
    try:
        with open(index_path, "r") as f:
            content = f.read()
        return HTMLResponse(content=content)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="index.html not found")

# Add routes for other pages
@app.get("/{page}", response_class=HTMLResponse)
async def get_page(page: str):
    """Serve HTML pages from the pages/ directory or the root"""
    # Check if page exists in pages directory
    page_path = base_dir / "pages" / f"{page}.html"
    
    # If not, check root directory
    if not page_path.exists():
        page_path = base_dir / f"{page}.html"
    
    if page_path.exists():
        with open(page_path, "r") as f:
            content = f.read()
        return HTMLResponse(content=content)
    
    raise HTTPException(status_code=404, detail=f"Page {page} not found")

# If you need to configure additional routes for your API endpoints
@app.get("/api/hello")
async def hello():
    return {"message": "Hello, World!"}

if __name__ == "__main__":
    # This code only runs when you execute the script directly
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)