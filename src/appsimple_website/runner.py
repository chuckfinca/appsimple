import uvicorn


def main():
    """Entry point for the 'website' command."""
    uvicorn.run("appsimple_website.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
