import sys
import os

# Add parent directory to path so we can import from main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from mangum import Mangum

# Handler for Vercel serverless
# Using lifespan="off" to avoid startup issues in serverless
handler = Mangum(app, lifespan="off")

# Also export app for direct access
__all__ = ["app", "handler"]
