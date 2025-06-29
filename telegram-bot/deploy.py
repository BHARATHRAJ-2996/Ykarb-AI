"""
Production deployment script for Ykarb Telegram Bot
Includes webhook setup and security configurations
"""

import os
import logging
from telegram.ext import ApplicationBuilder
import asyncio

# Production configuration
WEBHOOK_URL = os.getenv("WEBHOOK_URL")  # Your domain + /webhook
PORT = int(os.getenv("PORT", 8443))
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def setup_webhook():
    """Setup webhook for production deployment"""
    if not WEBHOOK_URL or not TELEGRAM_TOKEN:
        logger.error("Missing WEBHOOK_URL or TELEGRAM_TOKEN for production deployment")
        return
    
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
    
    # Set webhook
    await app.bot.set_webhook(
        url=f"{WEBHOOK_URL}/webhook",
        drop_pending_updates=True
    )
    
    logger.info(f"Webhook set to: {WEBHOOK_URL}/webhook")

if __name__ == "__main__":
    asyncio.run(setup_webhook())