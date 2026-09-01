"""
Vercel Serverless Function Entry Point for Hospital Management API
"""
import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from backend.main import app

# Export the FastAPI app handler for Vercel
handler = app
