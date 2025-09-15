# AppSimple Portfolio Website

This repository contains the source code for the AppSimple portfolio website, a personal site showcasing projects and expertise in mobile development and applied AI engineering. The site is built with a modern Python backend using the FastAPI framework and is designed for efficient, scalable deployment on Google App Engine.

## Technology Stack

- **Backend**: Python 3.9+, FastAPI
- **Server**: Uvicorn (local), Gunicorn (production)
- **Templating**: Jinja2
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Google App Engine
- **Dev Toolkit**: `uv`, `pytest`, `black`, `ruff`, `mypy`

---

## Local Development & Testing

Follow these steps to run the website on your local machine.

### 1. Prerequisites

- Python 3.9 or higher
- `uv` installed (`pip install uv`)

### 2. Setup

This is the standard setup. It will install the application and all necessary development tools.

**a. Create the virtual environment:**

```bash
uv venv
```

**b. Activate the environment:**

- macOS/Linux: `source .venv/bin/activate`
- Windows: `.venv\Scripts\activate`

**c. Install the project in editable mode with development dependencies:**

```bash
uv pip install -e ".[dev]"
```

### 3. Running the Local Server

After setup, run the application using its console script entry point. This command starts the web server with hot-reloading enabled.

```bash
uv run website
```

### 4. Viewing Your Website

Once the server is running, open your web browser and navigate to:

**http://127.0.0.1:8000**

## Development Tools

After setting up for development, you can use the following `uv run` commands to maintain code quality.

**Run Tests:**

```bash
uv run pytest
```

**Format Code:**

```bash
uv run black .
```

**Lint Code:**

```bash
uv run ruff check .
```

**Type Checking:**

```bash
uv run mypy src/
```

## Deployment to Google App Engine

Once your changes are tested locally, deploy them to Google App Engine.

### 1. Prerequisites

- **Google Cloud SDK (gcloud CLI)** installed and configured.
- A Google Cloud Platform (GCP) project with App Engine and billing enabled.

### 2. Authenticate & Configure

If this is your first time, authenticate with Google Cloud and set your project ID.

```bash
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]
```

### 3. Deploy

From the project's root directory (containing app.yaml), run the deploy command:

```bash
gcloud app deploy
```

Confirm the deployment by typing Y when prompted.

### 4. View the Deployed Site

After deployment is complete, open the live website in your browser:

```bash
gcloud app browse
```

---

You have now fully integrated the `uv` workflow and modern Python development practices into your website project.