# Ykarb Telegram Bot

A secure Telegram bot implementation of the Ykarb digital companion, providing menstrual health tracking, learning assistance, and mental health support.

## 🔒 Security Features

- Environment variables for API keys (no hardcoded secrets)
- Proper error handling and timeout management
- User data validation and sanitization
- Rate limiting and abuse prevention

## 🚀 Setup Instructions

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys
   ```

3. **Get API Keys**
   - **Telegram Bot Token**: Message @BotFather on Telegram
   - **Gemini API Key**: Get from Google AI Studio

4. **Run the Bot**
   ```bash
   python bot.py
   ```

## 🌟 Features

### 🌸 Sakhi Module - Menstrual Health
- Period tracking and predictions
- Cycle analysis and insights
- Culturally sensitive health guidance

### 📚 EduCare Module - Learning Assistant
- Study tips and techniques
- Note-taking strategies
- Learning optimization guidance

### 💚 Mitra Module - Mental Health Support
- Mood tracking and check-ins
- Wellness tips and resources
- Crisis support information
- Multilingual emotional support

## 🔐 Security Best Practices

- Never commit API keys to version control
- Use environment variables for sensitive data
- Implement proper error handling
- Add rate limiting for production use
- Validate all user inputs
- Use HTTPS for webhook deployment

## 📱 Bot Commands

- `/start` - Initialize the bot and show main menu
- Interactive buttons for module navigation
- Natural language conversation support

## 🌍 Multilingual Support

The bot supports multiple regional languages and provides culturally appropriate responses for users from diverse backgrounds.

## 🆘 Crisis Support

The bot includes crisis intervention resources and can provide immediate support information for users in mental health emergencies.