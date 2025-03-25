from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import yaml
import re
import os

app = FastAPI()

# Load and parse app.yaml
with open("app.yaml", "r") as yaml_file:
    handlers = yaml.safe_load(yaml_file)  # This is already a list of handlers

# Process app.yaml handlers
yaml_routes = []
for handler in handlers:  # Iterate directly through the list
    if "static_files" in handler and "url" in handler:
        yaml_routes.append({
            "url_pattern": handler["url"],
            "file_path": handler["static_files"]
        })

# Custom route handler based on app.yaml
@app.get("/{full_path:path}")
async def app_yaml_handler(request: Request, full_path: str = ""):
    # Handle root path specifically
    path = "/" + full_path if full_path else "/"
    
    # Try to match against app.yaml routes
    for route in yaml_routes:
        # Convert app engine regex to Python regex
        regex_pattern = "^" + route["url_pattern"] + "$"
        match = re.match(regex_pattern, path)
        
        if match:
            file_path = route["file_path"]
            
            # Handle capture groups like \1 in static_files
            if match.groups():
                for i, group in enumerate(match.groups(), 1):
                    file_path = file_path.replace(f"\\{i}", group)
            
            if os.path.exists(file_path):
                return FileResponse(file_path)
    
    # Special case for root
    if path == "/" and os.path.exists("index.html"):
        return FileResponse("index.html")
    
    return {"error": "Page not found", "path": path}, 404

# No-cache middleware
@app.middleware("http")
async def add_no_cache(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    response.headers["ETag"] = ""  # Disable ETag
    return response